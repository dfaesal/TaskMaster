from django.shortcuts import render
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from .models import CustomUser
from .serializers import UserRegistrationSerializer, UserLoginSerializer

####################   Authentication - register 

@api_view(['POST'])
def register(request):
	if request.method == 'POST':
		new_user_data = JSONParser().parse(request)
		user_email = new_user_data['email']
		user_role = new_user_data['role']
		if user_email is not None and user_role is not None:
			users = CustomUser.objects.all()
			user = users.filter(email__icontains=user_email)
			if(len(user) == 0):
				user, created = User.objects.get_or_create(username=new_user_data.get('username'),
					defaults={
    			    	'email': new_user_data.get('email'),
    			    	'first_name': new_user_data.get('username'),
					})
				if created:
					user.set_password(new_user_data.get('password'))
					user.save()
					new_user_data['user'] = user.id
					new_user_data['name'] = user.username
					serializer = UserRegistrationSerializer(data=new_user_data)
					if serializer.is_valid():
						serializer.save()
				else:
					return JsonResponse({'message': 'Not able to create User!'}, status=status.HTTP_400_BAD_REQUEST)
				return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
			else:
				return JsonResponse({'message': 'User already exists!'}, status=status.HTTP_202_ACCEPTED)
		else:
			return JsonResponse({'message': 'Check the registration details again!'}, status=status.HTTP_400_BAD_REQUEST)

####################   Authentication - login 
		
@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        user_data = JSONParser().parse(request)
        user_name = user_data.get('username')
        user_password = user_data.get('password')
        user_role = user_data.get('role')

        if user_name and user_role and user_password:
            users = CustomUser.objects.all()
            user = users.filter(name=user_name, password=user_password, role=user_role)

            if user and len(user) != 0:
                serializer = UserLoginSerializer(user, many=True)
                return JsonResponse(serializer.data, safe=False)
            else:
                return JsonResponse({'message': 'Invalid credentials or user not found'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return JsonResponse({'message': 'Incomplete login details. Please provide username, password, and role.'}, status=status.HTTP_400_BAD_REQUEST)
