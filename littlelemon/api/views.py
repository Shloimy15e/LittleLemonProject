from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.filters import SearchFilter

from core.models import Menu
from core.models import Booking

from .serializers import MenuSerializer
from .serializers import BookingSerializer

# Create your views here.

class MenuViewSet(ModelViewSet):
      serializer_class = MenuSerializer
      ordering_fields = ['name', 'price']
      ordering = ['name', 'price']
      search_fields = ['name', 'description']
      filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
      filterset_fields = ['name', 'price']
      def get_queryset(self):
            return Menu.objects.all()
    
class BookingViewSet(ModelViewSet):
      serializer_class = BookingSerializer
      filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
      ordering_fields = ['date', 'time']
      ordering = ['date', 'time']
      search_fields = ['name', 'email', 'phone', 'message']
      filterset_fields = ['date', 'time', 'number_of_people']
      # Set pagination
      pagination_class = None
      page_size = 100
      
      permission_classes = [IsAuthenticated]
      
      def get_queryset(self):
            return Booking.objects.all()
      
      def create(self, request, *args, **kwargs):
            data = request.data.copy()
            data['user'] = request.user.id
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)