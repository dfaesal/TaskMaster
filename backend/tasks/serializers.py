from rest_framework import serializers
from .models import Task, CustomUser
from django.contrib.auth.models import User

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class TaskUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['To Do', 'In Progress', 'Completed', 'On Hold'], required=False)
    priority = serializers.ChoiceField(choices=[
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ], required=False)
    username = serializers.CharField(required=False)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserRegistrationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    name = serializers.CharField()
    class Meta:
        model = CustomUser
        fields = ['name', 'email', 'password', 'role', 'user']

class UserLoginSerializer(serializers.Serializer):
    name = serializers.CharField()
    password = serializers.CharField()
    role = serializers.CharField()

    def validate(self, data):
        name = data.get('name')
        password = data.get('password')
        role = data.get('role')

        if name and password and role:
            user = CustomUser.objects.filter(name=name, role=role).first()

            if user and user.check_password(password):
                data['user'] = user
            else:
                raise serializers.ValidationError("Invalid username, password, or role.")
        else:
            raise serializers.ValidationError("Username, password, and role are required.")

        return data