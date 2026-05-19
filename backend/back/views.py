from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserListSerializer
from django.db.models import Count, Q
from django.utils.timezone import now
from datetime import date
from django.db import IntegrityError, transaction
from django.db import IntegrityError
from google.oauth2 import id_token
from google.auth.transport.requests import Request
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
User = get_user_model()
from django.conf import settings
import uuid
from django.core.mail import send_mail
from django.contrib.auth import get_user_model

User = get_user_model()



class fruitview(APIView):
    def get(self,request):
        fruit = Fruit.objects.all()
        serializer = FruitSerializer(fruit,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

    def post(self,request):
        serializer = FruitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class Userview(APIView):
    def post(self,request):
        serializer=UserSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.save()
            refresh=RefreshToken.for_user(user)

            return Response({
                "user":{
                    "id":user.id,
                    "username":user.username,
                    "email":user.email,
                    "role": user.role
                },
                "tokens":{
                    "refresh":str(refresh),
                    "access":str(refresh.access_token)
                }
            },status=status.HTTP_201_CREATED)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

from datetime import timedelta

class UserListView(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        users = User.objects.all()
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data)


class TicketView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        serializer=TicketSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors,status=400)

        data=serializer.validated_data

        start=data["fromdate"]
        end=data["todate"]
        capacity=data["count"]

        shows=["Morning show","Matinee show","First show","Second show"]

        try:
            with transaction.atomic():
                while start<=end:
                    for show in shows:
                        Ticket.objects.create(
                            movie_name=data["movie_name"],
                            organizer=data["organizer"],
                            screen_no=data["screen_no"],
                            date=start,
                            time=show,
                            capacity=capacity
                        )
                    start+=timedelta(days=1)

        except IntegrityError:
            return Response(
                {
                    "error":
                    "This screen is already assigned for one or more selected dates/shows"
                },
                status=400
            )

        return Response(
            {"msg":"Tickets Released Successfully"},
            status=201
        )


class MovieList(APIView):
    def get(self,request):
        return Response(
            Ticket.objects.filter(date__gte=date.today())
            .values("movie_name")
            .distinct()
        )

class DateList(APIView):
    def get(self,request):
        movie = request.GET["movie"]

        return Response(
            Ticket.objects.filter(
                movie_name=movie,
                date__gte=date.today() 
            )
            .values("date")
            .distinct()
            .order_by("date")
        )

class TheatreList(APIView):
    def get(self,request):
        movie = request.GET["movie"]
        selected_date = request.GET["date"]   

        return Response(
            Ticket.objects.filter(
                movie_name=movie,
                date=selected_date,
                date__gte=date.today()
            )
            .values("organizer")
            .distinct()
        )

class ScreenList(APIView):
    def get(self,request):
        movie=request.GET["movie"]
        selected_date=request.GET["date"]
        org=request.GET["organizer"]

        return Response(
            Ticket.objects.filter(
                movie_name=movie,
                date=selected_date,
                organizer=org,
                date__gte=date.today()
            )
            .values("screen_no")
            .distinct()
        )



class ShowList(APIView):
    def get(self,request):
        movie=request.GET["movie"]
        selected_date=request.GET["date"]
        org=request.GET["organizer"]
        screen=int(request.GET["screen"])

        return Response(
            Ticket.objects.filter(
                movie_name=movie,
                date=selected_date,
                organizer=org,
                screen_no=screen,
                date__gte=date.today()
            ).values("time","capacity","booked")
        )


# class BookTicket(APIView):
#     permission_classes=[IsAuthenticated]

#     def post(self,request):
#         movie=request.data["movie"]
#         date_=request.data["date"]
#         org=request.data["organizer"]
#         screen=int(request.data["screen"])
#         show=request.data["show"]
#         qty=int(request.data.get("qty",1))

#         try:
#             ticket=Ticket.objects.select_for_update().get(
#                 movie_name=movie,
#                 date=date_,
#                 organizer=org,
#                 screen_no=screen,
#                 time=show
#             )
#         except Ticket.DoesNotExist:
#             return Response({"error":"Show not found"},status=404)

#         available=ticket.capacity - ticket.booked
#         if available < qty:
#             return Response({"error":"Not enough tickets available"},status=400)

#         ticket.booked += qty
#         ticket.save()

#         return Response({"msg":f"{qty} ticket(s) booked successfully"})


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

class BookTicket(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        movie = request.data.get("movie")
        date_ = request.data.get("date")
        org = request.data.get("organizer")
        screen = int(request.data.get("screen"))
        show = request.data.get("show")
        qty = int(request.data.get("qty", 1))

        try:
            ticket = Ticket.objects.select_for_update().get(
                movie_name=movie,
                date=date_,
                organizer=org,
                screen_no=screen,
                time=show
            )
        except Ticket.DoesNotExist:
            return Response({"error": "Show not found"}, status=404)

        available = ticket.capacity - ticket.booked
        if available < qty:
            return Response({"error": "Not enough tickets available"}, status=400)

        ticket.booked += qty
        ticket.save()

        # 📧 Email
        user = request.user
        total = qty * 150

        name = user.email.split("@")[0].capitalize()

        subject = "Cinema Booking Confirmation"
        from_email = settings.DEFAULT_FROM_EMAIL
        to = [user.email]

        text_content = f"""
Hi {name},

Your booking is confirmed!

Movie: {movie}
Date: {date_}
Theatre: {org}
Screen: {screen}
Show Time: {show}
Tickets: {qty}

Total Paid: ₹{total}

Enjoy your show 
"""

        html_content = f"""
<h2 style="color:#2c3e50;">Booking Confirmed!</h2>

<p>Hi {name},</p>

<table style="border-collapse:collapse;">
    <tr><td><b>Movie:</b></td><td>{movie}</td></tr>
    <tr><td><b>Date:</b></td><td>{date_}</td></tr>
    <tr><td><b>Theatre:</b></td><td>{org}</td></tr>
    <tr><td><b>Screen:</b></td><td>{screen}</td></tr>
    <tr><td><b>Show Time:</b></td><td>{show}</td></tr>
    <tr><td><b>Tickets:</b></td><td>{qty}</td></tr>
</table>

<hr>

<h3>Total Paid: ₹{total}</h3>

<p style="color:green;">Enjoy your show </p>
"""

        try:
            msg = EmailMultiAlternatives(subject, text_content, from_email, to)
            msg.attach_alternative(html_content, "text/html")
            msg.send()
        except Exception as e:
            print("Email sending failed:", e)

        return Response({"msg": f"{qty} ticket(s) booked successfully"})
    


class GoogleLoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        token = request.data.get("id_token")

        if not token:
            return Response({"error":"id_token missing"},status=400)

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                Request(),
                settings.GOOGLE_CLIENT_ID
            )

            if not idinfo.get("email_verified"):
                return Response({"error":"email not verified"},status=400)

            email = idinfo.get("email")

            user = User.objects.filter(email=email).first()

            if not user:
                username=email.split("@")[0]+str(uuid.uuid4())[:4]
                user=User.objects.create_user(
                    username=username,
                    email=email
                )
                user.set_unusable_password()
                user.save()

            refresh=RefreshToken.for_user(user)

            return Response({
                "access":str(refresh.access_token),
                "refresh":str(refresh),
                "user":{
                    "username":user.username,
                    "email":user.email
                }
            })

        except ValueError:
            return Response({"error":"invalid google token"},status=400)
    