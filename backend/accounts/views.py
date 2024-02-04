from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView
from django.http import JsonResponse
from .utils import send_invitation_email 

from .models import UserAccount, CoachAssignment, CoachRequest, TrainingGroup, Invitation

from .serializers import UserSerializer, CoachRequestSerializer, TrainingGroupSerializer, CoachAssignmentSerializer, InvitationSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_group_info(request, group_id):
    try:
        group = TrainingGroup.objects.get(id=group_id)
    except TrainingGroup.DoesNotExist:
        return Response({'error': 'Training group not found'}, status=status.HTTP_404_NOT_FOUND)

    # Serialize the group information using your TrainingGroupSerializer
    serialized_group = TrainingGroupSerializer(group)

    return Response(serialized_group.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_user_from_group(request, group_id, user_id):
    try:
        group = TrainingGroup.objects.get(id=group_id)
        user = UserAccount.objects.get(id=user_id)
    except TrainingGroup.DoesNotExist:
        return Response({'error': 'Training group not found'}, status=status.HTTP_404_NOT_FOUND)
    except UserAccount.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if user in group.users.all():
        group.users.remove(user)
        return Response({'message': 'User removed from the group successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'User is not in the group'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_groups_assigned_to_user(request, user_id):
    try:
        user = UserAccount.objects.get(id=user_id)
    except UserAccount.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    groups_assigned = TrainingGroup.objects.filter(users=user)
    serializer = TrainingGroupSerializer(groups_assigned, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_groups_assigned_to_coach(request, coach_id):
    try:
        coach = UserAccount.objects.get(id=coach_id, role='coach')
    except UserAccount.DoesNotExist:
        return Response({'error': 'Coach not found'}, status=status.HTTP_404_NOT_FOUND)

    groups_assigned = TrainingGroup.objects.filter(coach=coach)
    serializer = TrainingGroupSerializer(groups_assigned, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_assigned_users_or_coaches(request, group_id, role):
    try:
        group = TrainingGroup.objects.get(id=group_id)
    except TrainingGroup.DoesNotExist:
        return Response({'error': 'Training group not found'}, status=status.HTTP_404_NOT_FOUND)

    if role not in ['coach', 'user']:
        return Response({'error': 'Invalid role specified'}, status=status.HTTP_400_BAD_REQUEST)
    # Filter the users based on the specified role
    if role == 'coach':
        assigned_users = group.coach.coached_groups.all()
    else:
        assigned_users = group.users.filter(role='player')

    # You can customize this based on your requirements.
    # Here, we assume that the 'role' field in UserAccount model specifies the role of a user.

    # Serialize the assigned users and return the response
    serialized_users = UserSerializer(assigned_users, many=True)  # Implement a serializer function as needed
    return Response(serialized_users.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_training_group(request):
    serializer = TrainingGroupSerializer(data=request.data)
    print(request.data)
    if serializer.is_valid():
        # Set the coach for the group as the currently authenticated user
        serializer.save(coach=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_users_to_training_group(request, groupId):
    try:
        group = TrainingGroup.objects.get(id=groupId)
    except TrainingGroup.DoesNotExist:
        return Response({'error': 'Training group not found'}, status=status.HTTP_404_NOT_FOUND)

    if group.coach != request.user:
        return Response({'error': 'You are not the coach of this group'}, status=status.HTTP_403_FORBIDDEN)
    
    user_id = int(request.data.get('user_id'))
    #user = UserAccount.objects.filter(id=user_id)
    group.users.add(user_id)
    
    try:
        user = UserAccount.objects.get(id=user_id)
    except UserAccount.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    serialized_user = UserSerializer(user)

    return Response({'user': serialized_user.data, 'message': 'Users added to the training group successfully'}, status=status.HTTP_200_OK)


@permission_classes([IsAuthenticated])
class CoachRequestCreateView(generics.CreateAPIView):
    serializer_class = CoachRequestSerializer

    def perform_create(self, serializer):
        sender = self.request.user
        receiver_id = self.request.data.get('receiver')
        receiver = UserAccount.objects.get(id=receiver_id)
        serializer.save(sender=sender, receiver=receiver)

@permission_classes([IsAuthenticated])
class CoachRequestDeleteView(generics.DestroyAPIView):
    queryset = CoachRequest.objects.all()
    serializer_class = CoachRequestSerializer
    
@permission_classes([IsAuthenticated])
class PendingCoachRequestsListView(generics.ListAPIView):
    serializer_class = CoachRequestSerializer

    def get_queryset(self):
        user = self.request.user
        return CoachRequest.objects.filter(receiver=user, status='pending')

class AboutPageView(RetrieveAPIView):
    queryset = UserAccount.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Return the currently authenticated user
        return self.request.user

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_page(request, user_id):
    try:
        user = UserAccount.objects.get(id=user_id)
        serializer = UserSerializer(user)  # Serialize the user data
        print(serializer.data)
        return Response(serializer.data)  # Return the serialized data as JSON
    except UserAccount.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_username_by_id(request, user_id):
    #user_id = request.user.id  # Assuming you want to get the username of the authenticated user

    try:
        user = UserAccount.objects.get(id=user_id)
        username = f'{user.first_name} {user.last_name}'
        print(username)
        return Response({username})
    except UserAccount.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    users = UserAccount.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_player_users(request):
    users = UserAccount.objects.filter(role="player")
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_coach_users(request):
    users = UserAccount.objects.filter(role='coach')  # Corrected the filter parameter
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_coach(request):
    user_id = request.data.get('user_id')
    coach_id = request.data.get('coach_id')
    #print (request)
    try:
        user = UserAccount.objects.get(id=user_id)
        coach = UserAccount.objects.get(id=coach_id)
    except UserAccount.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if user.role != 'player' or coach.role != 'coach':
        return Response({'error': 'Invalid roles for coach assignment'}, status=status.HTTP_400_BAD_REQUEST)

    assignment = CoachAssignment(user=user, coach=coach)
    assignment.save()

    return Response({'message': 'Coach assigned successfully'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_by_coach(request, coach_id):
    try:
        coach = UserAccount.objects.get(id=coach_id, role='coach')
    except UserAccount.DoesNotExist:
        return Response({'error': 'Coach not found'}, status=status.HTTP_404_NOT_FOUND)

    users = UserAccount.objects.filter(coach_assignments__coach=coach)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)
    # serialized_users = UserSerializer(users, many=True)

    # response_data = {
    #     'users': serialized_users.data,
    # }

    # return Response(response_data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_coach_notes(request, coach_id, user_id):
    try:
        coach = UserAccount.objects.get(id=coach_id, role='coach')
        user = UserAccount.objects.get(id=user_id)
    except UserAccount.DoesNotExist:
        return Response({'error': 'User or coach not found'}, status=status.HTTP_404_NOT_FOUND)

    # Ensure that the coach is assigned to the specified user
    if not CoachAssignment.objects.filter(coach=coach, user=user).exists():
        return Response({'error': 'Coach is not assigned to this user'}, status=status.HTTP_403_FORBIDDEN)

    # Retrieve and serialize coach notes for the specified user
    assignment = CoachAssignment.objects.get(coach=coach, user=user)
    serialized_assignment = CoachAssignmentSerializer(assignment)

    # Assuming 'notes' is the key for the notes field in your serialized data
    notes_data = serialized_assignment.data.get('notes', None)

    if notes_data is not None:
        return Response({'notes': notes_data}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Notes not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_coach_notes(request, coach_id, user_id):
    try:
        coach = UserAccount.objects.get(id=coach_id, role='coach')
        user = UserAccount.objects.get(id=user_id)
    except UserAccount.DoesNotExist:
        return Response({'error': 'User or coach not found'}, status=status.HTTP_404_NOT_FOUND)

    # Ensure that the coach is assigned to the specified user
    if not CoachAssignment.objects.filter(coach=coach, user=user).exists():
        return Response({'error': 'Coach is not assigned to this user'}, status=status.HTTP_403_FORBIDDEN)

    # Retrieve and update coach notes for the specified user
    assignment = CoachAssignment.objects.get(coach=coach, user=user)
    assignment.notes = request.data.get('notes', '')
    assignment.save()

    return Response({'success': 'Notes updated successfully'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_user_assignment(request, coach_id, user_id):
    try:
        coach_assignment = CoachAssignment.objects.get(coach_id=coach_id, user_id=user_id)

        # Remove user from associated training groups
        training_groups = TrainingGroup.objects.filter(coach_id=coach_id, users__id=user_id)
        for group in training_groups:
            group.users.remove(user_id)

        # Delete the coach assignment
        coach_assignment.delete()

        return JsonResponse({'userId': user_id}, status=status.HTTP_200_OK)
    except CoachAssignment.DoesNotExist:
        return Response({'error': 'Coach assignment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_invitation(request):
    if request.method != 'POST':
        return Response({'status': 'error', 'message': 'Invalid request method'})
    coach_id = request.user.id  # The logged-in coach's user ID
    receiver_email = request.data.get('inviteEmail')

    # Check if the receiver email is not already associated with a user
    if not UserAccount.objects.filter(email=receiver_email).exists():
        # Create the invitation
        invitation_data = {'coach': coach_id, 'receiver_email': receiver_email}
        serializer = InvitationSerializer(data=invitation_data)

        coachName = UserAccount.objects.get(id=coach_id).get_full_name()
        
        if serializer.is_valid():
            serializer.save()
            send_invitation_email(receiver_email, coachName)

            # Add logic to send an email with the invitation link (not implemented here)

            return Response({'status': 'success', 'message': 'Invitation created successfully'})
        else:
            return Response({'status': 'error', 'message': 'Invalid invitation data'})

    return Response({'status': 'error', 'message': 'Receiver email is already associated with a user'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_invitation(request):
    if request.method != 'POST':
        return Response({'status': 'error', 'message': 'Invalid request method'})
    
    receiver_email = request.data.get('email')

    # Check if there is a pending invitation for the given email
    try:
        invitation = Invitation.objects.get(receiver_email=receiver_email, status='pending')
        coach_id = invitation.coach.id
        user_id = UserAccount.objects.get(email=receiver_email).id
        return Response({'status': 'success', 'coachId': coach_id, 'userId': user_id})
    except Invitation.DoesNotExist:
        return Response({'status': 'success', 'coachId': None, 'userId': None})



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_invitation(request):
    if request.method != 'POST':
        return Response({'status': 'error', 'message': 'Invalid request method'})
    
    coach_id = request.data.get('coach_id')
    user_id = request.data.get('user_id')

    # Check if the invitation exists and is pending UserAccount.objects.get(id=coach_id).get_full_name()
    try:
        invitation = Invitation.objects.get(coach_id=coach_id, receiver_email=UserAccount.objects.get(id=user_id).email, status='pending')
        invitation.status = 'accepted'
        invitation.save()

        return Response({'status': 'success', 'message': 'Invitation accepted successfully'})
    except Invitation.DoesNotExist:
        return Response({'status': 'error', 'message': 'Invitation not found or not pending'})