from rest_framework import serializers
from .models import User
from .models import *


class FruitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fruit
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(
        choices=[("viewer", "Viewer"), ("organizer", "Organizer")],
        write_only=True
    )

    def validate_username(self, value):
        return value.strip()

    class Meta:
        model = User
        fields = ("username", "email", "password", "role")
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"




class TicketSerializer(serializers.Serializer):
    movie_name = serializers.CharField(max_length=100)
    screen_no = serializers.IntegerField(min_value=1)
    organizer = serializers.CharField(max_length=100)
    fromdate = serializers.DateField()
    todate = serializers.DateField()
    count = serializers.IntegerField(min_value=1)
