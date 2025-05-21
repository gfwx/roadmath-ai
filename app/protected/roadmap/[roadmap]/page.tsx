"use client"

import { useRoadmapContext } from "@/app/context/RoadmapContext";
import { marked } from "marked";
import katex from 'katex';
import 'katex/dist/katex.min.css';
import DOMPurify from "dompurify";
import { useState } from "react";

interface RoadmapPageProps {
  params: { slug: string };
}

function renderWithKaTeX(html: string): string {
  // Process display mode LaTeX ($$...$$)
  let processedHtml = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, expr) => {
    try {
      // Check for common LaTeX bracket expressions
      let fixedExpr = expr.trim();
      // Handle special LaTeX notations like [\frac{...}]
      const hasBrackets = /\[(.*)\]/.test(fixedExpr);
      if (hasBrackets) {
        fixedExpr = fixedExpr.replace(/\[(.*)\]/, "\\left[$1\\right]");
      }
      
      return katex.renderToString(fixedExpr, { 
        displayMode: true, 
        throwOnError: false,
        trust: true,
        strict: false
      });
    } catch (e) {
      console.error("KaTeX display mode error:", e);
      return match; // Return original on error
    }
  });
  
  // Process inline LaTeX ($...$) - avoid processing already processed formulas
  processedHtml = processedHtml.replace(/\$([^\$]+?)\$/g, (match, expr) => {
    if (match.includes('katex-html') || match.includes('katex-mathml')) {
      return match;
    }
    try {
      // Check for common LaTeX bracket expressions
      let fixedExpr = expr.trim();
      // Handle special LaTeX notations like [\frac{...}]
      const hasBrackets = /\[(.*)\]/.test(fixedExpr);
      if (hasBrackets) {
        fixedExpr = fixedExpr.replace(/\[(.*)\]/, "\\left[$1\\right]");
      }
      
      return katex.renderToString(fixedExpr, { 
        displayMode: false, 
        throwOnError: false,
        trust: true,
        strict: false
      });
    } catch (e) {
      console.error("KaTeX inline mode error:", e);
      return match; // Return original on error
    }
  });
  
  return processedHtml;
}

export default function RoadmapPage({ params }: RoadmapPageProps) {
  const selectedNode = useRoadmapContext()?.node;
  const selectedRoadmap = useRoadmapContext()?.roadmap;
  const selectedNodeData = useRoadmapContext()?.node_data;

  // If the URL is directly accessed, we need to handle potential null data
  // The selectedNodeData will be available after the context is hydrated

  if (selectedNode == null || !selectedNodeData) {
    return (
      <div>
        <h2>This is the roadmap page for: {selectedRoadmap ? selectedRoadmap.title : ""}</h2>
        <p>Loading content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl">{selectedNode.title}</h1>
      <p>{selectedNode.description}</p>

      {selectedNodeData?.data?.map((item, index) => {
        // Process markdown with proper newline handling
        const content = item.markdown_formatted_content || '';
        // Ensure newlines are properly processed
        const processedContent = content.replace(/\\n/g, '\n');
        
        // Pre-process LaTeX in code blocks to prevent it from being rendered
        const protectedContent = processedContent.replace(/```[\s\S]*?```/g, match => {
          return match.replace(/\$/g, '&#36;');
        });
        
        const rawHtml = marked.parse(protectedContent);
        const htmlWithMath = renderWithKaTeX(rawHtml);
        const cleanHtml = DOMPurify.sanitize(htmlWithMath, {
          ADD_ATTR: ['class', 'style'], // Preserve classes and styles for styling
          ADD_TAGS: ['span', 'math', 'mrow', 'mi', 'mo', 'mfrac', 'msup', 'mfenced'], // Allow math tags
          USE_PROFILES: { html: true, svg: true, mathMl: true } // Allow math notation
        });

        // Debug state for this content item
        const [showDebug, setShowDebug] = useState(false);

        return (
          <div key={index}>
            <h1 className="text-3xl font-bold mb-4">
              {item.header} 
              <button 
                className="ml-2 text-sm bg-gray-200 px-2 py-1 rounded" 
                onClick={() => setShowDebug(!showDebug)}
              >
                {showDebug ? 'Hide Debug' : 'Debug'}
              </button>
            </h1>
            
            {showDebug && (
              <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto max-h-96">
                <h3 className="font-bold">Original Content:</h3>
                <pre className="whitespace-pre-wrap text-xs">{content}</pre>
                <h3 className="font-bold mt-2">Processed Content:</h3>
                <pre className="whitespace-pre-wrap text-xs">{processedContent}</pre>
                <h3 className="font-bold mt-2">Raw HTML:</h3>
                <pre className="whitespace-pre-wrap text-xs overflow-x-auto">{rawHtml}</pre>
              </div>
            )}
            
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
          </div>
        );
      })}
    </div>
  );
}
