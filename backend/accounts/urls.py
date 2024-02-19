from django.urls import path
from .views import (get_users, 
                    get_player_users, 
                    get_coach_users, get_user_page, get_username_by_id, 
                    assign_coach, get_users_by_coach, AboutPageView, CoachRequestDeleteView, 
                    CoachRequestCreateView, PendingCoachRequestsListView, create_training_group,  
                    add_users_to_training_group,  get_assigned_users_or_coaches,
                    get_groups_assigned_to_user,
                    get_groups_assigned_to_coach,  
                    remove_user_from_group,
                    get_group_info,
                    get_coach_notes,
                    update_coach_notes,
                    remove_user_assignment,
                    create_invitation,
                    check_invitation,
                    accept_invitation
)
urlpatterns = [
    path('users/', get_users, name='get_users'),
    path('user-about/<int:user_id>/', get_user_page, name='get_user_page'),
    path('player-users/', get_player_users, name='get_player_users'),
    path('coach-users/', get_coach_users, name='get_coach_users'),
    path('assign-coach/', assign_coach, name='assign_coach'),
    path('users-by-coach/<int:coach_id>/', get_users_by_coach, name='get_users_by_coach'),
    path('get-name-by-id/<int:user_id>/', get_username_by_id, name='get-name-by-id'),
    path('coach-requests/', CoachRequestCreateView.as_view(), name='create-coach-request'),
    path('pending-coach-requests/', PendingCoachRequestsListView.as_view(), name='pending-coach-requests'),
    path('delete-coach-request/<int:pk>/', CoachRequestDeleteView.as_view(), name='coachrequest-delete'),
    path('about/', AboutPageView.as_view(), name='about-page'),
    path('create-training-group/', create_training_group, name='create-training-group'),
    path('add-users-to-group/<int:groupId>/', add_users_to_training_group, name='add-users-to-group'),
    path('assigned-coaches/<int:group_id>/', get_assigned_users_or_coaches, {'role': 'coach'}, name='assigned-coaches'),
    path('assigned-users/<int:group_id>/', get_assigned_users_or_coaches, {'role': 'user'}, name='assigned-users'),
    path('groups-assigned-to-user/<int:user_id>/', get_groups_assigned_to_user, name='groups-assigned-to-user'),
    path('groups-assigned-to-coach/<int:coach_id>/', get_groups_assigned_to_coach, name='groups-assigned-to-coach'),
    path('remove-user-from-group/<int:group_id>/<int:user_id>/', remove_user_from_group, name='remove-user-from-group'),
    path('group-info/<int:group_id>/', get_group_info, name='get-group-info'),
    # Add the new URL pattern for coach notes
    path('coach-notes/<int:coach_id>/<int:user_id>/', get_coach_notes, name='get-coach-notes'),
    path('update-coach-notes/<int:coach_id>/<int:user_id>/', update_coach_notes, name='update_coach_notes'),
    path('remove-coach-assignment/<int:coach_id>/<int:user_id>/', remove_user_assignment, name='remove_user_assignment'),
    path('create-invitation/', create_invitation, name='create_invitation'),
    path('check-invitation/', check_invitation, name='check_invitation'),
    path('accept-invitation/', accept_invitation, name='accept_invitation'),
 

]
