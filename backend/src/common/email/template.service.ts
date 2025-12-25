import { Injectable } from '@nestjs/common';
import * as handlebars from 'handlebars';  
import { readFileSync, existsSync } from 'fs';  
import { join } from 'path';  
  
@Injectable()  
export class TemplateService {    
  private templates: Map<string, handlebars.TemplateDelegate> = new Map();
  // Path to the email templates directory
  private readonly templatesPath = join(process.cwd(), 'src', 'common', 'email', 'templates');  
  
  // Compile and cache email templates
  compile(template: string, context: Record<string, any>): { html: string; error: string | null } {  
    if (!this.templates.has(template)) {  
      const templatePath = join(this.templatesPath, `${template}.hbs`);  
  
      // Verify that the template file actually exists.  
      if (!existsSync(templatePath)) {  
        return { html: '', error: `Template "${template}" not found at ${templatePath}` };  
      }  
  
      // Read the template content and compile it, then store it in the cache.  
      const templateContent = readFileSync(templatePath, 'utf-8');  
      this.templates.set(template, handlebars.compile(templateContent));
    }
    
    const compiledTemplate = this.templates.get(template);
    if (!compiledTemplate) {  
      return { html: '', error: `Failed to retrieve compiled template "${template}". This should not happen.` };  
    }  
  
    try {
      return { html: compiledTemplate(context), error: null };  
    } catch (error: any) {  
      // Catch any errors during template rendering.  
      return { html: '', error: `Error rendering template "${template}": ${error.message}` };  
    }  
  }  
}