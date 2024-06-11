from authentication_backend import views
from django.urls import path

urlpatterns = [
     path('register',views.signup,name='register'),
     path('login',views.login,name='login'),
     path('logout',views.logout,name='logout'),
     path('createmovie',views.create_movie,name='createmovie'),
     path('viewmovie/<int:pk>/', views.viewMovie, name='viewmovie'),
     path('listmovie', views.ListMovie, name='listmovie'),
     path('editmovie/<int:pk>',views.update_movie, name='update'),
     path('delete/<int:pk>/',views.delete_movie, name='delete'),
     path('create-booking/', views.create_booking, name='create_booking'),
     path('list-bookings/<int:user_id>/', views.list_bookings_by_user, name='list_bookings_by_user'),
     path('initiate-payment/', views.initiate_payment, name='initiate-payment'),
     path('generate-qr-code/', views.sent_email_response, name='generate_qr_code'),
     path('booking-pdf/<str:booking_id>/', views.generate_booking_pdf, name='generate_booking_pdf')
]
