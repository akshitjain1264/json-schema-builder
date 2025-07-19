import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Settings } from 'lucide-react';
import SchemaField from './SchemaField';
import JsonPreview from './JsonPreview';
import { SchemaFormData, SchemaField as SchemaFieldType } from '@/types/schema';

const JsonSchemaBuilder: React.FC = () => {
  const { control, watch } = useForm<SchemaFormData>({
    defaultValues: {
      fields: [
        {
          id: 'field_1',
          name: 'name',
          type: 'String',
          nested: []
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields',
  });

  const watchedFields = watch('fields');

  const addField = () => {
    const newField: SchemaFieldType = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      type: 'String',
      nested: []
    };
    append(newField);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">JSON Schema Builder</h1>
        <p className="text-muted-foreground">Create dynamic JSON schemas with nested fields and real-time preview</p>
      </div>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Schema Builder
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <span className="text-xs">{ }</span>
            JSON Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Schema Fields</CardTitle>
                <Button onClick={addField} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Field
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No fields added yet. Click "Add Field" to get started.</p>
                </div>
              ) : (
                fields.map((field, index) => (
                  <SchemaField
                    key={field.id}
                    control={control}
                    field={field}
                    fieldIndex={index}
                    onRemove={() => remove(index)}
                    fieldArrayName="fields"
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <JsonPreview fields={watchedFields || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JsonSchemaBuilder;