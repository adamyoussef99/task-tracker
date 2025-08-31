import graphene
from graphene_django.types import DjangoObjectType
from .models import Task

class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = (
            "id",
            "title",
            "description",
            "due_date",
            "is_complete",
            "created_at",
        )

class Query(graphene.ObjectType):
    all_tasks = graphene.List(TaskType)
    task_by_id = graphene.Field(TaskType, id=graphene.Int(required=True))
    incomplete_tasks = graphene.List(TaskType)
    completed_tasks = graphene.List(TaskType)

    def resolve_all_tasks(self, info):
        return Task.objects.all()
    
    def resolve_task_by_id(root, info, id):
        return Task.objects.filter(id=id).first()

    def resolve_incomplete_tasks(root, info):
        return Task.objects.filter(is_complete=False).order_by("due_date")
    
    def resolve_completed_tasks(root, info):
        return Task.objects.filter(is_complete=True).order_by("due_date")

class CreateTask(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String()
        due_date = graphene.Date()

    task = graphene.Field(TaskType)

    def mutate(root, info, title, description=None, due_date=None):
        task = Task(title=title, description=description or "", due_date=due_date)
        task.save()
        return CreateTask(task=task)

class TaskInput(graphene.InputObjectType):
    title = graphene.String(required=True)
    description = graphene.String()
    due_date = graphene.Date()

class CreateMultipleTasks(graphene.Mutation):
    class Arguments:
        tasks = graphene.List(graphene.NonNull(TaskInput), required=True)

    tasks = graphene.List(TaskType)

    def mutate(root, info, tasks):
        created_tasks = []
        for task_data in tasks:
            task = Task(
                title=task_data.title,
                description=task_data.description or "",
                due_date=task_data.due_date
            )
            task.save()
            created_tasks.append(task)
        return CreateMultipleTasks(tasks=created_tasks)
    
class UpdateTask(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        due_date = graphene.Date()
        is_complete = graphene.Boolean()

    task = graphene.Field(TaskType)

    def mutate(root, info, id, title=None, description=None, due_date=None, is_complete=None):
        try:
            task = Task.objects.get(pk=id)
            if title is not None:
                task.title = title
            if description is not None:
                task.description = description
            if due_date is not None:
                task.due_date = due_date
            if is_complete is not None:
                task.is_complete = is_complete
            task.save()
            return UpdateTask(task=task)
        except Task.DoesNotExist:
            return UpdateTask(task=None)
    
class DeleteTask(graphene.Mutation):
    ok = graphene.Boolean()
    class Arguments:
        id = graphene.ID(required=True)

    def mutate(self, info, id):
        try:
            task = Task.objects.get(pk=id)
            task.delete()
            return DeleteTask(ok=True)
        except Task.DoesNotExist:
            return DeleteTask(ok=False)

class Mutation(graphene.ObjectType):
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    delete_task = DeleteTask.Field()
    creat_multiple_tasks = CreateMultipleTasks.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)