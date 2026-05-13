from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404


# Base View for send response,CRUD and pagination
class BaseView(APIView):
    # Model
    model = None

    # Serializer 
    list_serializer = None
    retrieve_serializer = None
    create_serializer = None

    update_serializer = None

    # get_object
    def _get_object(self,pk):
        return get_object_or_404(self.model,pk=pk)

    # Get Model Name
    @property
    def get_model_name(self):
        return self.model.__name__ if self.model else "Item"
    # Get Serializer
    def get_serializer(self,serializer_class_name=None,*args,**kwargs):
        if getattr(self,'swagger_fake_view',False):
            return None 
        serializer_class = getattr(self,serializer_class_name,None)
        if not serializer_class:
            raise NotImplementedError(f"{serializer_class_name} is not defined")
        return serializer_class(*args,**kwargs)

    # Get Queryset
    def get_queryset(self):
        if not self.model:
            raise NotImplementedError('Model is not defined')
        
        queryset = self.model.objects.all()
        if hasattr(self.model,'created_at'):
            queryset = queryset.order_by('-created_at')
        # if hasattr(self.model,'date_joined'):
        #     queryset = queryset.order_by('-date_joined')

        return self.filter_queryset(queryset)
    

    def send_response(self,data=None,message="",success=True,status_code=status.HTTP_200_OK,meta=None):
        response_data = {
            "statusCode":status_code,
            "success":success,
            "message":message,
            "data":data,
            "meta":meta
        }
        return Response(response_data,status=status_code)
    

    def filter_queryset(self,queryset):
        params = self.request.query_params

        filter_dict = {}

        model_fields = {
            field.name: field for field in self.model._meta.get_fields()
        }

        for key,value in params.items():
            # if key in [field.name for field in self.model._meta.get_fields()]:
            #     filter_dict[key] = value
            if key in model_fields:
                field = model_fields[key]

                from django.db.models import BooleanField
                if isinstance(field,BooleanField):
                    value = value.lower() in ['true','1']
                filter_dict[key] = value 
        if filter_dict:
            queryset = queryset.filter(**filter_dict)
        
        return queryset
    
    @property
    def method_not_allowed_response(self):
        return self.send_response(success=False,message="Method not allowed.",status_code=status.HTTP_405_METHOD_NOT_ALLOWED)

    def filter_queryset_dynamic(self,queryset,request):
        from django.db.models import Q,CharField,TextField,ForeignKey
        qs = queryset
        search = request.query_params.get('search')

        if search:
            search = search.lower()

            string_fields = [field.name for field in self.model._meta.get_fields() if isinstance(field,(CharField,TextField))]

            q_objects = Q()
            for field in string_fields:
                q_objects |= Q(**{f"{field}__icontains":search})
            qs = qs.filter(q_objects)
        
        for param,value in request.query_params.items():
            if param == 'search' or param in ['page','limit']:
                continue
            
            if hasattr(queryset.model,param):
                field = queryset.model._meta.get_field(param)
                if isinstance(field,ForeignKey):
                        qs = qs.filter(**{f"{param}__id":value})
                else:
                    qs = qs.filter(**{f"{param}__icontains":value})
        return qs 
    
    # Pagination
    def paginate_queryset(self,queryset,request):
        if not self.list_serializer:
            raise NotImplementedError("list_serializer is not defined.")
        
        queryset = self.filter_queryset_dynamic(queryset,request)
        
        paginator = PageNumberPagination()
        paginator.page_size_query_param = "limit"
        page = paginator.paginate_queryset(queryset,request)

        serializer = self.get_serializer('list_serializer',page or queryset,many=True,context={'request':request})
        meta = None
        if page is not None:
            meta = {
                "page":paginator.page.number,
                "limit":paginator.get_page_size(request),
                "totalPage":paginator.page.paginator.num_pages,
                "total":paginator.page.paginator.count,
                "previous":paginator.get_previous_link(),
                "next":paginator.get_next_link()
            }
            return self.send_response(data=serializer.data,message="List fetched",meta=meta)
        
        return self.send_response(data=serializer.data,message="List fetched",meta=meta)
    
    
    # CRUD
    # GET > List or Retrieve
    def get(self,request,pk=None):
        if pk:
            instance = get_object_or_404(self.get_queryset(),pk=pk)
            self.check_object_permissions(request,instance)
            serializer = self.get_serializer('retrieve_serializer',instance,context={'request':request})
            return self.send_response(data=serializer.data,message=f"{self.get_model_name()} fetched")
        else:
            queryset = self.get_queryset()
            return self.paginate_queryset(queryset,request)
    
    # POST > Create
    def post(self,request):
        serializer = self.get_serializer('create_serializer',data=request.data,context={'request':request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return self.send_response(data=serializer.data,message=f"{self.get_model_name()} created",status_code=status.HTTP_201_CREATED)

    # PUT > Update
    def put(self,request,pk):
        instance = get_object_or_404(self.get_queryset(),pk=pk)
        self.check_object_permissions(request,instance)
        serializer = self.get_serializer('update_serializer',instance,data=request.data,partial=True,context={'request':request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return self.send_response(data=serializer.data,message=f"{self.get_model_name()} updated",status_code=status.HTTP_200_OK)
    
    # PATCH > Partial Update

    def patch(self,request,pk):
        instance = get_object_or_404(self.get_queryset(),pk=pk)
        self.check_object_permissions(request,instance)
        serializer = self.get_serializer('update_serializer',instance,data=request.data,partial=True,context={'request':request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return self.send_response(data=serializer.data,message=f"{self.get_model_name()} partially updated")

    def delete(self,request,pk):
        instance =get_object_or_404(self.get_queryset(),pk=pk)
        self.check_object_permissions(request,instance)
        instance.delete()
        return self.send_response(data=None,message=f"{self.get_model_name()} deleted",status_code=status.HTTP_204_NO_CONTENT)
    