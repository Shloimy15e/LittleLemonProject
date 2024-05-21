from typing import Any
from django.shortcuts import render
import requests
import json

from django.views.generic import TemplateView 
from django.conf import settings 

# Create your views here.
class IndexView(TemplateView):
      template_name = 'index.html'
      
class AboutView(TemplateView):
      template_name = 'about.html'
      
class MenuView(TemplateView):
      template_name = 'menu.html'
      def get_context_data(self, **kwargs):
            context = super().get_context_data(**kwargs)
            try:
                  response = requests.get(settings.API_URL + 'menu/')
                  response.raise_for_status()  
                  context['menu'] = response.json()['results']
                  context['message'] = 'Menu fetched successfully'
            except requests.exceptions.RequestException as e:
                  print(f"RequestException: {e}")
                  context['error'] = 'Error: ' + str(e)
                  context ['message'] = 'Error fetching menu: ' + str(e)
            except json.JSONDecodeError as e:
                  print(f"JSONDecodeError: {e}")
                  context['error'] = 'Error: ' + str(e)
                  context ['message'] = 'Error fetching menu: ' + str(e)
            return context
      
class BookView(TemplateView):
      template_name = 'book.html'
      
class BookingsView(TemplateView):
      template_name = 'bookings.html'
      
      def get_context_data(self, **kwargs):
            context = super().get_context_data(**kwargs)
            try:
                  response = requests.get(settings.API_URL + 'bookings/')
                  response.raise_for_status()  
                  context['bookings'] = response.json()
            except requests.exceptions.RequestException as e:
                  context['error'] = 'Error: ' + str(e)
            return context
      
class LoginView(TemplateView):
      template_name = 'login.html'

      