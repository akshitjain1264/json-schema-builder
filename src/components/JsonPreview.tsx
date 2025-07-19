import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SchemaField, FieldType } from '@/types/schema';

interface JsonPreviewProps {
  fields: SchemaField[];
}

const generateDefaultValue = (type: FieldType): any => {
  switch (type) {
    case 'String':
      return '';
    case 'Number':
      return 0;
    case 'Boolean':
      return false;
    case 'Float':
      return 0.0;
    case 'ObjectID':
      return '507f1f77bcf86cd799439011';
    case 'Array':
      return [];
    case 'Date':
      return new Date().toISOString();
    case 'Email':
      return 'user@example.com';
    case 'URL':
      return 'https://example.com';
    case 'Nested':
      return {};
    default:
      return '';
  }
};

const generateJsonFromSchema = (fields: SchemaField[]): any => {
  const result: any = {};
  
  fields.forEach(field => {
    if (!field.name.trim()) return;
    
    if (field.type === 'Nested' && field.nested && field.nested.length > 0) {
      result[field.name] = generateJsonFromSchema(field.nested);
    } else {
      result[field.name] = generateDefaultValue(field.type);
    }
  });
  
  return result;
};

const JsonPreview: React.FC<JsonPreviewProps> = ({ fields }) => {
  const { toast } = useToast();
  const jsonOutput = generateJsonFromSchema(fields);
  const jsonString = JSON.stringify(jsonOutput, null, 2);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      toast({
        title: "Success",
        description: "JSON copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy JSON to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success", 
      description: "JSON file downloaded",
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">JSON Preview</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 px-2"
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadJson}
            className="h-8 px-2"
          >
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted rounded-md p-4 overflow-auto max-h-96">
          <pre className="text-sm text-muted-foreground font-mono">
            {jsonString}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default JsonPreview;