from django.urls import path
from .views import CreateTaskView, TaskListAPIView

urlpatterns = [
    # ...
    path('create/', CreateTaskView.as_view(), name='create-task'),
    path('view/', TaskListAPIView.as_view(), name='view-task')
]