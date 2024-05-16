from django.db import models

# Create your models here.
class Booking(models.Model):
      name = models.CharField(max_length=100)
      email = models.EmailField()
      phone = models.CharField(max_length=20, null=True)
      date = models.DateField()
      time = models.TimeField()
      number_of_people = models.IntegerField()
      message = models.TextField()
      created_at = models.DateTimeField(auto_now_add=True)
      updated_at = models.DateTimeField(auto_now=True)
      def __str__(self):
          return f'{self.name} - {self.date} - {self.time}'
    