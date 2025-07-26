import graphene
from graphene_django.types import DjangoObjectType
from .models import Task

class TaskType(DjangoObjectType):
    class Meta:
        model = Task

class Query(graphene.ObjectType):
    all_tasks = graphene.List(TaskType)

    def resolve_all_tasks(self, info):
        return Task.objects.all()

class CreateTask(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        description = graphene.String()
        due_date = graphene.types.datetime.Date()

    task = graphene.Field(TaskType)

    def mutate(self, info, title, description=None, due_date=None):
        task = Task(title=title, description=description, due_date=due_date)
        task.save()
        return CreateTask(task=task)

class Mutation(graphene.ObjectType):
    create_task = CreateTask.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)