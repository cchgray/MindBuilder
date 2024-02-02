from rest_framework import viewsets, status
from .models import CalendarEvent, UserEventStatus
from .serializers import CalendarEventSerializer, UserEventStatusSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from accounts.models import UserAccount,TrainingGroup
from rest_framework.decorators import api_view, permission_classes


class CalendarEventViewSet(viewsets.ModelViewSet):
    queryset = CalendarEvent.objects.all()
    serializer_class = CalendarEventSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        selectedUser = self.request.data.get('user')
        user = UserAccount.objects.get(id=selectedUser['id'])  # Assuming you have a User model
        serializer.save(user=user)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['GET'])
    def list_by_user(self, request):
        user_id = request.query_params.get('user_id')
        if user_id is None:
            return Response({'error': 'user_id parameter is required.'}, status=400)

        events = CalendarEvent.objects.filter(user_id=user_id)
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def list_by_group(self, request):
        group_id = request.query_params.get('group_id')
        if group_id is None:
            return Response({'error': 'group_id parameter is required.'}, status=400)

        events = CalendarEvent.objects.filter(group_id=group_id)
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
 
class UserEventStatusViewSet(viewsets.ModelViewSet):
    serializer_class = UserEventStatusSerializer

    def get_queryset(self):
        event_id = self.request.query_params.get('event')
        user_id = self.request.query_params.get('user')
        queryset = UserEventStatus.objects.all()

        if event_id and user_id:
            # Filter based on event.id and user.id
            queryset = queryset.filter(event=event_id, user=user_id)

        if event_id:
            # Filter based on event.id and user.id
            queryset = queryset.filter(event=event_id)

        return queryset
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_group(request, group_id):
        
        group = TrainingGroup.objects.get(id=group_id)
        # 1. Remove all users
        try:
            group.users.clear()
        except TrainingGroup.DoesNotExist:
            return Response({'error': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)

        # 2. Delete all events by group
        try:
            events = CalendarEvent.objects.filter(group_id=group.id)
            events.delete()
        except TrainingGroup.DoesNotExist:
            return Response({'error': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)

        # 3. Delete the group
        try:
            group.delete()
        except TrainingGroup.DoesNotExist:
            return Response({'error': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_204_NO_CONTENT)