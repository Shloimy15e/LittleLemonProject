from django.db import models

# Create your models here.
# Model for the Menu
class Menu(models.Model):
      name = models.CharField(max_length=100)
      description = models.TextField(null=True)
      price = models.DecimalField(max_digits=5, decimal_places=2)
      created_at = models.DateTimeField(auto_now_add=True)
      updated_at = models.DateTimeField(auto_now=True)
      def __str__(self):
          return f'{self.name} - {self.price}'
    
# Model for the reservations
class Booking(models.Model):
      name = models.CharField(max_length=100)
      email = models.EmailField()
      phone = models.CharField(max_length=20, null=True)
      date = models.DateField()
      time = models.TimeField()
      number_of_people = models.IntegerField()
      message = models.TextField(null=True)
      created_at = models.DateTimeField(auto_now_add=True)
      updated_at = models.DateTimeField(auto_now=True)
      def __str__(self):
          return f'{self.name} - {self.date} - {self.time}'