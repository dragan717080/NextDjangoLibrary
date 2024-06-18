class BaseRepository():   
    def get_all(self, req):
        # Only fetch related models if 'related' property is set in corresponding repository
        query_args = {key: value for key, value in req.GET.items()}

        limit = False
        if 'limit' in query_args.keys():
            limit = int(query_args['limit'])
            del query_args['limit']

        sort_by = '-created_at'
        if 'sort_by' in query_args.keys():
            sort_by = query_args['sort_by']
            del query_args['sort_by']

        try:
            # 'related' is list of related models on many side to one
            # 'many_related' is list of related many to many models to one (e.g. book.many_related = 'book_genre')
            query_set = self.model.objects.select_related(*self.related).prefetch_related(*self.many_related)

            query_set = query_set.filter(**query_args)
        except AttributeError:
            query_set = self.model.objects.filter(**query_args)

        query_set.order_by(sort_by)

        if limit:
            query_set = query_set[:limit]

        return query_set

    def get_by_id(self, id):
        try:
            return self.model.objects.get(pk=id)
        except self.model.DoesNotExist:
            return None

    def get_by_fields(self, fields):
        try:
            return self.model.objects.get(**fields)
        except self.model.DoesNotExist:
            return None

    def get_list_by_fields(self, fields):
        """ When expecting list from queryset """
        return self.model.objects.filter(**fields)

    def delete(self, id):
        try:
            model_instance = self.model.objects.get(pk=id)
            model_instance.delete()
            return 1
        except self.model.DoesNotExist:
            return None
