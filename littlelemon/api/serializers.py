import re
import phonenumbers

from rest_framework import serializers

from django.core.exceptions import ValidationError
from django.core.validators import validate_email

from django.utils import timezone

from menu.models import Menu
from booking.models import Booking

class MenuSerializer(serializers.ModelSerializer):
      class Meta:
            model = Menu
            fields = '__all__'
           
      # validators 
      def validate_price(self, value):
            if value < 0:
                  raise serializers.ValidationError('Price must be greater than 0')
            return value
      
      def validate_name(self, value):
            if len(value) < 3:
                  raise serializers.ValidationError('Name must be at least 3 characters long')
            if len(value) > 100:
                  raise serializers.ValidationError('Name may not be longer than 100 characters')
            if re.search('<.*?>', value) or re.search('&.*?;|%', value):
                  raise serializers.ValidationError('Name may not contain HTML tags')
            return value     
           
      def validate_description(self, value):
            if re.search('<.*?>', value) or re.search('&.*?;|%', value):
                  raise serializers.ValidationError('Description may not contain HTML tags')
            return value
        
        
        
class BookingSerializer(serializers.ModelSerializer):
      class Meta:
            model = Booking
            fields = '__all__'
            
      # validators
      def validate_name(self, value):
            if len(value) < 3:
                  raise serializers.ValidationError('Name must be at least 3 characters long')
            if len(value) > 100:
                  raise serializers.ValidationError('Name may not be longer than 100 characters')
            if re.search('<.*?>', value) or re.search('&.*?;|%', value):
                  raise serializers.ValidationError('Name may not contain HTML tags')
            return value
      
      def validate_email(self, value):
            try:
                  validate_email(value)
            except ValidationError:
                  raise serializers.ValidationError('Invalid email address')
            return value
      
      def validate_phone(self, value):
            try:
                  phone_number = phonenumbers.parse(value)
                  if not phonenumbers.is_valid_number(phone_number):
                        raise serializers.ValidationError('Invalid phone number')
            except phonenumbers.phonenumberutil.NumberParseException:
                  raise serializers.ValidationError('Invalid phone number')
            return value
      
      def validate_date(self, value):
            if value < timezone.now().date():
                  raise serializers.ValidationError('Date must be in the future')
            return value
      
      def validate_time(self, value):
            if value < timezone.now().time():
                  raise serializers.ValidationError('Time must be in     the future')
            return value
      
      def validate_number_of_people(self, value):
            if value < 1:
                  raise serializers.ValidationError('Number of people must be greater than 0')
            return value
      