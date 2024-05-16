from rest_framework.viewsets import ModelViewSet
from menu.models import Menu
from booking.models import Booking

from .serializers import MenuSerializer
from .serializers import BookingSerializer

# Create your views here.

class MenuViewSet(ModelViewSet):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer
    
class BookingViewSet(ModelViewSet):
      queryset = Booking.objects.all()
      serializer_class = BookingSerializer
      
      