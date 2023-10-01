from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TaskSerializer
from .models import Task
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .serializers import TaskUpdateSerializer, UserSerializer, UserRegistrationSerializer, UserLoginSerializer
from django.shortcuts import get_object_or_404

class CreateTaskView(APIView):
    #permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        data = request.data
        user = data.get('assigned_to')
        if user:
            try:
                userId = User.objects.get(username=user)
                data['assigned_to'] = userId.id
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            data = serializer.data
            assigned_to_id = data['assigned_to']
            if assigned_to_id:
                try:
                    user = User.objects.get(pk=assigned_to_id)
                    data['assigned_to'] = user.username
                except User.DoesNotExist:
                    pass
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskListAPIView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user_name = request.query_params.get('user')
        user_role = request.query_params.get('role')

        if not user_name or not user_role:
            return Response({'message': 'User and role parameters are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=user_name)
        except User.DoesNotExist:
            return Response({'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user_role == 'team_leader':
            tasks = Task.objects.all()
        else:
            tasks = Task.objects.filter(assigned_to=user)

        if not tasks.exists():
            return Response({'message': 'No tasks available for this user.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskSerializer(tasks, many=True)
        data = serializer.data

        # Modify the JSON data to change assigned_to to username
        for task_data in data:
            assigned_to_id = task_data['assigned_to']
            if assigned_to_id:
                try:
                    assigned_to_user = User.objects.get(pk=assigned_to_id)
                    task_data['assigned_to'] = assigned_to_user.username
                except User.DoesNotExist:
                    pass

        return Response(data, status=status.HTTP_200_OK)

class TaskUpdateAPIView(APIView):
    def patch(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskUpdateSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            new_status = serializer.validated_data.get('status')
            new_priority = serializer.validated_data.get('priority')
            username = serializer.validated_data.get('username')

            # Update status if provided
            if new_status and task.status != new_status:
                task.status = new_status

            # Update priority if provided
            if new_priority and task.priority != new_priority:
                task.priority = new_priority

            # Update assignment if username is provided
            if username:
                try:
                    team_member = User.objects.get(username=username)
                except User.DoesNotExist:
                    return Response({'error': 'Team member not found.'}, status=status.HTTP_404_NOT_FOUND)

                # Check if the task is already assigned to the selected team member
                if task.assigned_to != team_member:
                    # Update the task's assignment
                    task.assigned_to = team_member

                    # Notify the team member about the new task assignment

            task.save()
            return Response({'message': 'Task updated successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class TaskDetailView(APIView):
    def get(self, request, task_id):
        # Retrieve the task by its ID or return a 404 error if not found
        task = get_object_or_404(Task, pk=task_id)

        # Serialize the task data
        serializer = TaskSerializer(task)
        resp = serializer.data
        try:
            team_member = User.objects.get(id=resp["assigned_to"])
            resp["assigned_to"] = team_member.username
        except User.DoesNotExist:
            pass
        # Return the task details as a JSON response
        return Response(resp, status=status.HTTP_200_OK)
    
class UserListView(APIView):
    def get(self, request):
        # Retrieve a list of users from the database
        users = User.objects.all()
        
        # Serialize the list of users
        serializer = UserSerializer(users, many=True)
        
        # Return the serialized data as a JSON response
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserDetailView(APIView):
    def get(self, request, user_id):
        # Retrieve the task by its ID or return a 404 error if not found
        user = get_object_or_404(User, pk=user_id)

        # Serialize the task data
        serializer = UserSerializer(user)

        # Return the task details as a JSON response
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            return Response({'message': 'Login successful.', 'user_id': user.id, 'role': user.role})
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)