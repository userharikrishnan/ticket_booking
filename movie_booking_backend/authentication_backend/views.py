from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from django.contrib.auth.forms import UserCreationForm
from rest_framework import status
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django import forms
from .serializers import MovieSerializer, Movie, BookingSerializer
from .models import Movie,BookingRegister
from django.shortcuts import get_object_or_404
import json
from django.http import JsonResponse
from django.conf import settings
import razorpay
import qrcode
import base64
from io import BytesIO
from django.core.mail import EmailMessage
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from django.http import HttpResponse




#register

class ExtendedUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta(UserCreationForm.Meta):
        fields = UserCreationForm.Meta.fields + ('email',)

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    form = ExtendedUserCreationForm(request.data)
    if form.is_valid():
        user = form.save()
        return Response("Account created successfully", status=status.HTTP_201_CREATED)
    else:
        print(form.errors)
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


# Login a User

@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if username is None or password is None or email is None:
        return Response({'error': 'Please provide username , email and password'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(username=username,email=email,password=password)

    if not user:
        return Response({'error': 'Invalid Credentials'}, status=HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'id': user.id, 'username': user.username,'email': user.email, 'token': token.key}, status=HTTP_200_OK)



# User Logout

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    if request.method == 'POST':
        request.user.auth_token.delete()
        return Response({'Message': 'You are logged out'},status=status.HTTP_200_OK)



# Add New Movie

@api_view(['POST'])
@permission_classes((AllowAny,))
def create_movie(request):
    serializer = MovieSerializer(data=request.data)
    if serializer.is_valid():
        instance = serializer.save()
        return Response({'id': instance.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



#List single movie

@api_view(['GET'])
@permission_classes((AllowAny,))
def viewMovie(request, pk):
    try:
        product = Movie.objects.get(pk=pk)
        serializer = MovieSerializer(product)
        return Response(serializer.data)
    except Movie.DoesNotExist:
        return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)


# List Movie

@api_view(['GET'])
@permission_classes([AllowAny])
def ListMovie(request):
    products = Movie.objects.all()
    serializer = MovieSerializer(products, many=True)
    return Response(serializer.data)


# Update Movie

@api_view(['POST'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def update_movie(request, pk):
    movie = get_object_or_404(Movie, pk=pk)
    serializer = MovieSerializer(movie, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Movie updated successfully', 'data': serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Delete Movie
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_movie(request, pk):
    movie = get_object_or_404(Movie, pk=pk)
    movie.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)



# book movie

@api_view(['POST'])
@permission_classes([AllowAny]) 
def create_booking(request):
    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([AllowAny]) 
def list_bookings_by_user(request, user_id):
    bookings = BookingRegister.objects.filter(user_id=user_id)
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)




#razorpay payment


@csrf_exempt
def initiate_payment(request):
    if request.method == "POST":
        try:
            
            data = json.loads(request.body)
            
            client = razorpay.Client(auth=(settings.RAZORPAY_API_KEY, settings.RAZORPAY_API_SECRET))
            
            order_amount = data['amount']
            order_currency = data['currency']
            order_receipt = data['orderId']
            order_notes = {'description': data['description']}
            
            
            order = client.order.create(dict(amount=order_amount, currency=order_currency, receipt=order_receipt, notes=order_notes))
            
            order['order_notes'] = order_notes
            
            return JsonResponse(order, status=200)
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)



# sent email

@csrf_exempt
def sent_email_response(request):
    if request.method == 'POST':
        
        data = json.loads(request.body)
        movie_name = data.get('movieName', '')
        total_price = data.get('totalPrice', '')
        no_of_seats = data.get('noOfSeats', '')
        payment_id = data.get('paymentID', '')
        receipt_id = data.get('receiptId', '')
        email_id = data.get('email', '')
        booking_date = data.get('bookingDate', '')
        show_time = data.get('showTime', '')


        
        email_body = (f"Movie booked successfully.\n\n"
                      f"Details of your booking:\n"
                      f"Movie Name: {movie_name}\n"
                      f"Show Time: {show_time}\n"
                      f"Booking Date: {booking_date}\n"
                      f"Number of Seats: {no_of_seats}\n"
                      f"Amount: {total_price}\n"
                      f"Payment id: {payment_id}\n"
                      f"Reciept id: {receipt_id}\n")

        
        email = EmailMessage(
            'Booking Details',
            email_body,
            'developmenttesting421@gmail.com',  
            [email_id],
        )
        email.send()

        
        return JsonResponse({'message': 'Email with booking details sent succesfully'})

    return JsonResponse({'error': 'Method not allowed'}, status=405)




# generate pdf with qr

@csrf_exempt
def generate_booking_pdf(request, booking_id):
    if request.method == 'GET':
            
            print(f"Fetching booking with ID: {booking_id}") 
            booking = BookingRegister.objects.get(booking_id=booking_id)

            qr_data = f"Movie: {booking.moviename}, Amount: {booking.total_price}, Seats: {booking.quantity}, Booking ID: {booking.booking_id}, Show Date & Time: {booking.booked_date}, {booking.show_date}"
            qr = qrcode.make(qr_data)

            qr_buffer = BytesIO()
            qr.save(qr_buffer, format='PNG')
            qr_buffer.seek(0)
            qr_image = ImageReader(qr_buffer)

            buffer = BytesIO()
            p = canvas.Canvas(buffer, pagesize=letter)
            p.drawImage(qr_image, 100, 500, width=200, height=200)
            p.drawString(100, 450, "Scan this QR to know booking details")
            p.showPage()
            p.save()
            buffer.seek(0)

            
            response = HttpResponse(buffer, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="booking_{booking.booking_id}.pdf"'
            return response
    return HttpResponse('Method not allowed', status=405)