from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db import models
from django.conf import settings

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    
    ROLE_CHOICES = (
        ("viewer", "Viewer"),
        ("organizer", "Organizer"),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="viewer")


class Fruit(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=50)

    def __str__(self):
        return self.name



class Ticket(models.Model):
    movie_name=models.CharField(max_length=100)
    organizer=models.CharField(max_length=100)
    screen_no=models.IntegerField()
    date=models.DateField()
    time=models.CharField(max_length=50)

    capacity=models.IntegerField()
    booked=models.IntegerField(default=0)

    class Meta:
        constraints=[
            models.UniqueConstraint(
                fields=["organizer","screen_no","date","time"],
                name="unique_show_per_screen"
            )
        ]

    def __str__(self):
        return f"{self.movie_name} | {self.organizer} | Screen {self.screen_no} | {self.date} | {self.time}"

