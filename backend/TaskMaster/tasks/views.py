from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TaskSerializer
from .models import Task
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User

#class CreateTaskView(APIView):
#    permission_classes = [IsAuthenticated]
#
#    def post(self, request, format=None):
#        user_id = request.user.id if request.user.is_authenticated else None
#        request.data['user'] = user_id  # Set the user to the logged-in user or None
#        serializer = TaskSerializer(data=request.data)
#        if serializer.is_valid():
#            serializer.save()
#            return Response(serializer.data, status=status.HTTP_201_CREATED)
#        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateTaskView(APIView):
    #permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        try:
            data = request.data
            user = User.objects.get(username=request.data.get('assigned_to'))
            data['assigned_to'] = user.id
        except User.DoesNotExist:
            return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskListAPIView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        tasks = Task.objects.all()
        if not tasks.exists():
            return Response({'message': 'No tasks available for this user.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)