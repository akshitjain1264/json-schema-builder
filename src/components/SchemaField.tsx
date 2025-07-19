import React from 'react';
import { Control, useFieldArray, useController } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { SchemaFormData, SchemaField as SchemaFieldType, FieldType } from '@/types/schema';

interface SchemaFieldProps {
  control: Control<SchemaFormData>;
  field: SchemaFieldType;
  fieldIndex: number;
  onRemove: () => void;
  nestingLevel?: number;
  fieldArrayName: string;
}

const SchemaField: React.FC<SchemaFieldProps> = ({
  control,
  field,
  fieldIndex,
  onRemove,
  nestingLevel = 0,
  fieldArrayName
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const { toast } = useToast();
  
  const nestedFieldsArrayName = `${fieldArrayName}.${fieldIndex}.nested`;
  
  const { fields: nestedFields, append: appendNested, remove: removeNested } = useFieldArray({
    control,
    name: nestedFieldsArrayName as any,
  });

  const nameController = useController({
    control,
    name: `${fieldArrayName}.${fieldIndex}.name` as any,
    defaultValue: field.name
  });

  const typeController = useController({
    control,
    name: `${fieldArrayName}.${fieldIndex}.type` as any,
    defaultValue: field.type
  });

  const validateFieldName = (newName: string) => {
    if (!newName.trim()) {
      toast({
        title: "Validation Error",
        description: "Field name cannot be empty",
        variant: "destructive",
      });
      return false;
    }

    // Get all sibling fields to check for duplicates
    const parentFieldsPath = fieldArrayName.split('.').slice(0, -1).join('.');
    const siblingFields = parentFieldsPath ? control._getWatch(parentFieldsPath) : control._getWatch('fields');
    
    if (siblingFields && Array.isArray(siblingFields)) {
      const duplicateExists = siblingFields.some((sibling: SchemaFieldType, index: number) => 
        index !== fieldIndex && sibling.name.trim().toLowerCase() === newName.trim().toLowerCase()
      );
      
      if (duplicateExists) {
        toast({
          title: "Validation Error", 
          description: "Field name already exists at this level",
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };

  const addNestedField = () => {
    const newField: SchemaFieldType = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      type: 'String',
      nested: []
    };
    appendNested(newField);
  };

  const canHaveNested = typeController.field.value === 'Nested';

  return (
    <Card className={cn(
      "relative",
      nestingLevel > 0 && "ml-6 border-l-2 border-l-accent"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {canHaveNested && nestedFields.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <div className="flex-1">
            <Input
              placeholder="Field name"
              value={nameController.field.value}
              onChange={(e) => {
                const newValue = e.target.value;
                nameController.field.onChange(newValue);
              }}
              onBlur={() => {
                const currentValue = nameController.field.value;
                if (currentValue && !validateFieldName(currentValue)) {
                  nameController.field.onChange('');
                }
              }}
              className="text-sm"
            />
          </div>
          
          <div className="w-1/3">
            <Select
              value={typeController.field.value}
              onValueChange={(value: FieldType) => {
                typeController.field.onChange(value);
                // Clear nested fields when changing away from Nested type
                if (value !== 'Nested') {
                  // Remove all nested fields
                  const currentNested = control._getWatch(nestedFieldsArrayName);
                  if (currentNested && currentNested.length > 0) {
                    for (let i = currentNested.length - 1; i >= 0; i--) {
                      removeNested(i);
                    }
                  }
                }
              }}
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="String">String</SelectItem>
                <SelectItem value="Number">Number</SelectItem>
                <SelectItem value="Boolean">Boolean</SelectItem>
                <SelectItem value="Float">Float</SelectItem>
                <SelectItem value="ObjectID">ObjectID</SelectItem>
                <SelectItem value="Array">Array</SelectItem>
                <SelectItem value="Date">Date</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="URL">URL</SelectItem>
                <SelectItem value="Nested">Nested</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {canHaveNested && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addNestedField}
              className="h-8 px-2"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="h-8 px-2 text-destructive hover:text-destructive-foreground hover:bg-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {canHaveNested && nestedFields.length > 0 && isExpanded && (
          <div className="space-y-2 mt-4">
            {nestedFields.map((nestedField, nestedIndex) => (
              <SchemaField
                key={nestedField.id}
                control={control}
                field={nestedField as SchemaFieldType}
                fieldIndex={nestedIndex}
                onRemove={() => removeNested(nestedIndex)}
                nestingLevel={nestingLevel + 1}
                fieldArrayName={nestedFieldsArrayName}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SchemaField;