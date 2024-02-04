from django.core.mail import send_mail

def send_invitation_email(receiver_email, coach_name):
    subject = 'Invite to join Mindbuilder'
    message = f'You are invited by {coach_name} to join Mindbuilder. Please click the link to make your account: http://www.themindbuilder.org/signup'
    from_email = 'your@email.com'
    recipient_list = [receiver_email]

    send_mail(subject, message, from_email, recipient_list)
