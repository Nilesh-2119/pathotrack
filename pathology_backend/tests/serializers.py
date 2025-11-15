from rest_framework import serializers
from .models import Test, Tube


class TubeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tube
        fields = ["id", "name"]
        read_only_fields = ["id"]


class TestSerializer(serializers.ModelSerializer):
    # show nested tubes (read-only)
    tubes = TubeSerializer(many=True, read_only=True)

    # accept tube names when creating/updating (write-only)
    tube_names = serializers.ListField(
        child=serializers.CharField(max_length=120), write_only=True, required=False
    )

    class Meta:
        model = Test
        fields = [
            "id",
            "lab",
            "name",
            "category",
            "description",
            "normal_range",
            "unit",
            "price",
            "is_active",
            "tubes",
            "tube_names",
            "created_at",
        ]
        read_only_fields = ["lab", "created_at", "tubes"]

    def create(self, validated_data):
        tube_names = validated_data.pop("tube_names", [])
        request_user = self.context["request"].user
        lab = request_user.lab

        # create test with lab
        test = Test.objects.create(lab=lab, **validated_data)

        # create or get tubes scoped to lab and associate
        tubes_to_set = []
        for tn in tube_names:
            tn_clean = tn.strip()
            if not tn_clean:
                continue
            tube_obj, _ = Tube.objects.get_or_create(lab=lab, name=tn_clean)
            tubes_to_set.append(tube_obj)

        if tubes_to_set:
            test.tubes.set(tubes_to_set)

        return test

    def update(self, instance, validated_data):
        tube_names = validated_data.pop("tube_names", None)
        request_user = self.context["request"].user
        lab = request_user.lab

        # normal update
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()

        # replace tubes if tube_names provided
        if tube_names is not None:
            tubes_to_set = []
            for tn in tube_names:
                tn_clean = tn.strip()
                if not tn_clean:
                    continue
                tube_obj, _ = Tube.objects.get_or_create(
                    lab=lab, name=tn_clean)
                tubes_to_set.append(tube_obj)
            instance.tubes.set(tubes_to_set)

        return instance
