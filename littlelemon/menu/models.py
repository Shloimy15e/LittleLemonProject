from django.db import models

# Create your models here.
class Menu(models.Model):
      name = models.CharField(max_length=100)
      description = models.TextField(null=True)
      price = models.DecimalField(max_digits=5, decimal_places=2)
      created_at = models.DateTimeField(auto_now_add=True)
      updated_at = models.DateTimeField(auto_now=True)
      def __str__(self):
          return f'{self.name} - {self.price}'