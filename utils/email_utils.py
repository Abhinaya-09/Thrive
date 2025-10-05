import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import configparser
import os

def load_email_config():
    config = configparser.ConfigParser()
    config_path = os.path.join(os.path.dirname(__file__), 'email.properties')
    config.read(config_path)
    return config['email']['sender_email'], config['email']['sender_password']

def send_welcome_email(to_email, full_name):
    sender_email, sender_password = load_email_config()
    
    subject = "🎉 Welcome to Our App!"
    body = f"""
    Hi {full_name},

    Welcome to our platform! 🎉
    We're excited to have you on board.

    You can now log in and start exploring.

   Thrive,
    The Team 🚀
    """

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, to_email, msg.as_string())
        print(f"📧 Welcome email sent to {to_email}")
    except Exception as e:
        print(f" Failed to send email to {to_email}: {e}")