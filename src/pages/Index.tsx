import JsonSchemaBuilder from '@/components/JsonSchemaBuilder';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <JsonSchemaBuilder />
      <footer>
        <h2 className="text-center text-sm text-muted-foreground mt-4 px-2">
          Made by Akshit Jain {' | '}
          <a
            href="https://github.com/akshitjain/schema-craft-builder"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2"
          >
            GitHub
          </a>
          {' | '}
          <a
            href="https://www.linkedin.com/in/akshit-jain-2392602a9/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2"
          >
            LinkedIn
          </a>
          {' | '}
          <a
            href="mailto:toakshit2004@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2"
          >
            toakshit2004@gmail.com
          </a>
          
        </h2>
      </footer>
    </div>
  );
};

export default Index;
