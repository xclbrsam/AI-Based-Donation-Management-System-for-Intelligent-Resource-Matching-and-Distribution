from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import NGO
from .serializers import NGOSerializer


class NGOListCreateView(APIView):

    def get(self, request):
        ngos = NGO.objects.all()
        serializer = NGOSerializer(ngos, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = NGOSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NGODetailView(APIView):

    def get_object(self, pk):
        try:
            return NGO.objects.get(pk=pk)
        except NGO.DoesNotExist:
            return None

    def get(self, request, pk):
        ngo = self.get_object(pk)

        if not ngo:
            return Response({"error": "NGO not found"}, status=404)

        serializer = NGOSerializer(ngo)
        return Response(serializer.data)

    def put(self, request, pk):
        ngo = self.get_object(pk)

        if not ngo:
            return Response({"error": "NGO not found"}, status=404)

        serializer = NGOSerializer(ngo, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        ngo = self.get_object(pk)

        if not ngo:
            return Response({"error": "NGO not found"}, status=404)

        ngo.delete()
        return Response({"message": "NGO deleted successfully"})