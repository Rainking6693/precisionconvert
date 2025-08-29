#!/usr/bin/env python3
"""
Blog Post QA Audit Script for PrecisionConvert.io
Validates HTML structure, links, metadata, and accessibility for blog posts
"""

import os
import re
import json
from pathlib import Path
from datetime import datetime

class BlogQAAuditor:
    def __init__(self):
        self.base_path = Path("C:/Users/Ben/OneDrive/Documents/GitHub/precisionconvert")
        self.issues = {
            'high': [],
            'medium': [],
            'low': []
        }
        self.blog_posts = []
        
    def find_blog_posts(self):
        """Find all blog posts in content/blog directory"""
        blog_dir = self.base_path / "content" / "blog"
        if blog_dir.exists():
            for md_file in blog_dir.glob("*.md"):
                self.blog_posts.append(md_file)
        return len(self.blog_posts)
    
    def validate_frontmatter(self, content, filename):
        """Validate blog post frontmatter"""
        if not content.startswith('---'):
            self.issues['high'].append(f"{filename}: Missing frontmatter markers")
            return False
            
        try:
            # Extract frontmatter
            parts = content.split('---', 2)
            if len(parts) < 3:
                self.issues['high'].append(f"{filename}: Invalid frontmatter structure")
                return False
                
            frontmatter = parts[1].strip()
            required_fields = ['title', 'description', 'date', 'slug']
            
            for field in required_fields:
                if f'{field}:' not in frontmatter:
                    self.issues['high'].append(f"{filename}: Missing required field '{field}'")
                    
            # Check ogImage path
            if 'ogImage:' in frontmatter:
                og_match = re.search(r'ogImage:\s*"([^"]+)"', frontmatter)
                if og_match:
                    og_path = og_match.group(1)
                    if og_path.startswith('/'):
                        full_path = self.base_path / og_path[1:]
                        if not full_path.exists():
                            self.issues['medium'].append(f"{filename}: ogImage path does not exist: {og_path}")
                            
        except Exception as e:
            self.issues['high'].append(f"{filename}: Error parsing frontmatter: {str(e)}")
            return False
            
        return True
    
    def validate_headings(self, content, filename):
        """Validate heading structure (H1, H2 order)"""
        lines = content.split('\n')
        h1_count = 0
        last_heading_level = 0
        heading_issues = []
        
        for i, line in enumerate(lines, 1):
            if line.startswith('#'):
                level = len(line.split(' ')[0])
                
                if level == 1:
                    h1_count += 1
                    if h1_count > 1:
                        heading_issues.append(f"Line {i}: Multiple H1 headings (found {h1_count})")
                        
                # Check for heading hierarchy jumps
                if last_heading_level > 0 and level > last_heading_level + 1:
                    heading_issues.append(f"Line {i}: Heading hierarchy skip (H{last_heading_level} to H{level})")
                    
                last_heading_level = level
        
        if h1_count == 0:
            self.issues['high'].append(f"{filename}: No H1 heading found")
        
        for issue in heading_issues:
            self.issues['medium'].append(f"{filename}: {issue}")
            
        return h1_count == 1
    
    def validate_internal_links(self, content, filename):
        """Check all internal links in the blog post"""
        # Find all markdown links
        link_pattern = r'\[([^\]]+)\]\(([^\)]+)\)'
        links = re.findall(link_pattern, content)
        
        broken_links = []
        for link_text, link_url in links:
            # Check internal links only
            if link_url.startswith('/') and not link_url.startswith('//'):
                # Remove anchor if present
                path = link_url.split('#')[0]
                
                # Check if the file exists
                if path == '/':
                    full_path = self.base_path / 'index.html'
                else:
                    # Try with .html extension
                    full_path = self.base_path / path[1:]
                    if not full_path.exists():
                        full_path = self.base_path / (path[1:] + '.html')
                        
                if not full_path.exists():
                    broken_links.append(f"'{link_text}' -> {link_url}")
                    
        for broken_link in broken_links:
            self.issues['high'].append(f"{filename}: Broken internal link: {broken_link}")
            
        return len(broken_links) == 0
    
    def validate_tables(self, content, filename):
        """Validate table formatting if present"""
        lines = content.split('\n')
        in_table = False
        table_issues = []
        
        for i, line in enumerate(lines, 1):
            if '|' in line:
                if not in_table:
                    in_table = True
                    # Check if next line is separator
                    if i < len(lines) and '|' in lines[i]:
                        separator = lines[i]
                        if not re.match(r'^[\s\|:\-]+$', separator):
                            table_issues.append(f"Line {i+1}: Invalid table separator")
                            
                # Count columns
                cols = [c.strip() for c in line.split('|') if c.strip()]
                if in_table and len(cols) < 2:
                    table_issues.append(f"Line {i}: Table row has less than 2 columns")
            else:
                in_table = False
                
        for issue in table_issues:
            self.issues['medium'].append(f"{filename}: {issue}")
            
        return len(table_issues) == 0
    
    def validate_json_ld(self, content, filename):
        """Validate JSON-LD structured data if present"""
        json_ld_pattern = r'<script type="application/ld\+json">(.*?)</script>'
        json_blocks = re.findall(json_ld_pattern, content, re.DOTALL)
        
        for i, json_block in enumerate(json_blocks, 1):
            try:
                data = json.loads(json_block.strip())
                
                # Check required fields
                if '@context' not in data:
                    self.issues['medium'].append(f"{filename}: JSON-LD block {i} missing @context")
                if '@type' not in data:
                    self.issues['medium'].append(f"{filename}: JSON-LD block {i} missing @type")
                    
                # Validate Article type
                if data.get('@type') == 'Article':
                    required = ['headline', 'datePublished', 'author']
                    for field in required:
                        if field not in data:
                            self.issues['low'].append(f"{filename}: JSON-LD Article missing '{field}'")
                            
            except json.JSONDecodeError as e:
                self.issues['high'].append(f"{filename}: Invalid JSON-LD in block {i}: {str(e)}")
                
        return True
    
    def check_accessibility(self, content, filename):
        """Basic accessibility checks"""
        # Check for images without alt text
        img_pattern = r'!\[([^\]]*)\]\([^\)]+\)'
        images = re.findall(img_pattern, content)
        
        for i, alt_text in enumerate(images, 1):
            if not alt_text.strip():
                self.issues['medium'].append(f"{filename}: Image {i} missing alt text")
                
        # Check for link text quality
        link_pattern = r'\[([^\]]+)\]\([^\)]+\)'
        links = re.findall(link_pattern, content)
        
        generic_link_text = ['click here', 'here', 'read more', 'link', 'this']
        for link_text in links:
            if link_text.lower().strip() in generic_link_text:
                self.issues['low'].append(f"{filename}: Generic link text '{link_text}' (poor for accessibility)")
                
        return True
    
    def validate_blog_post(self, filepath):
        """Validate a single blog post"""
        filename = filepath.name
        print(f"\n📝 Validating: {filename}")
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Run all validations
            self.validate_frontmatter(content, filename)
            self.validate_headings(content, filename)
            self.validate_internal_links(content, filename)
            self.validate_tables(content, filename)
            self.validate_json_ld(content, filename)
            self.check_accessibility(content, filename)
            
        except Exception as e:
            self.issues['high'].append(f"{filename}: Error reading file: {str(e)}")
    
    def check_blog_html_integration(self):
        """Check if blog posts are properly linked in blog.html"""
        blog_html = self.base_path / "blog.html"
        if not blog_html.exists():
            self.issues['high'].append("blog.html: File not found")
            return
            
        with open(blog_html, 'r', encoding='utf-8') as f:
            html_content = f.read()
            
        # Check if new blog posts are referenced
        for post in self.blog_posts:
            slug = post.stem  # filename without extension
            if slug not in html_content:
                self.issues['medium'].append(f"blog.html: Blog post '{post.name}' not referenced")
    
    def generate_report(self):
        """Generate the QA audit report"""
        print("\n" + "="*80)
        print("✅ BLOG QA AUDIT REPORT - PrecisionConvert.io")
        print("="*80)
        
        print(f"\n📊 Summary:")
        print(f"   • Blog posts found: {len(self.blog_posts)}")
        print(f"   • High priority issues: {len(self.issues['high'])}")
        print(f"   • Medium priority issues: {len(self.issues['medium'])}")
        print(f"   • Low priority issues: {len(self.issues['low'])}")
        
        if self.issues['high']:
            print("\n🔴 HIGH PRIORITY ISSUES (Must fix before deploy):")
            for i, issue in enumerate(self.issues['high'], 1):
                print(f"   {i}. {issue}")
                
        if self.issues['medium']:
            print("\n🟡 MEDIUM PRIORITY ISSUES (Should fix):")
            for i, issue in enumerate(self.issues['medium'], 1):
                print(f"   {i}. {issue}")
                
        if self.issues['low']:
            print("\n🟢 LOW PRIORITY ISSUES (Nice to have):")
            for i, issue in enumerate(self.issues['low'], 1):
                print(f"   {i}. {issue}")
        
        # Launch readiness score
        total_issues = sum(len(issues) for issues in self.issues.values())
        high_weight = len(self.issues['high']) * 3
        medium_weight = len(self.issues['medium']) * 2
        low_weight = len(self.issues['low'])
        weighted_issues = high_weight + medium_weight + low_weight
        
        # Score calculation (10 = perfect, decreases with issues)
        score = max(0, 10 - (weighted_issues * 0.2))
        score = round(score, 1)
        
        print("\n" + "="*80)
        print(f"📊 Launch Readiness Score: {score}/10")
        print("="*80)
        
        print("\n📋 RECOMMENDED FIX ORDER:")
        fix_order = []
        
        # Group issues by type for easier fixing
        link_issues = [i for i in self.issues['high'] if 'link' in i.lower()]
        if link_issues:
            fix_order.append("1. Fix all broken internal links (create missing pages or update URLs)")
            
        og_issues = [i for i in self.issues['medium'] if 'ogImage' in i]
        if og_issues:
            fix_order.append("2. Create og-images directory and add placeholder images")
            
        structure_issues = [i for i in self.issues['high'] if 'frontmatter' in i.lower() or 'heading' in i.lower()]
        if structure_issues:
            fix_order.append("3. Fix markdown structure issues (frontmatter, headings)")
            
        integration_issues = [i for i in self.issues['medium'] if 'blog.html' in i]
        if integration_issues:
            fix_order.append("4. Update blog.html to include new blog posts")
            
        if not fix_order:
            fix_order.append("• No critical issues found - ready for deployment!")
        else:
            for item in fix_order:
                print(f"   {item}")
        
        print("\n📎 Tools Used:")
        print("   • Markdown parser for structure validation")
        print("   • Link checker for internal URL validation")
        print("   • JSON validator for structured data")
        print("   • Accessibility scanner for WCAG compliance")
        print("   • Integration tester for blog.html references")
        
        return score

if __name__ == "__main__":
    import sys
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    
    auditor = BlogQAAuditor()
    
    # Find all blog posts
    post_count = auditor.find_blog_posts()
    print(f"🔍 Found {post_count} blog posts to audit")
    
    if post_count < 5:
        auditor.issues['medium'].append(f"Expected 5 blog posts, found only {post_count}")
    
    # Validate each blog post
    for post in auditor.blog_posts:
        auditor.validate_blog_post(post)
    
    # Check blog.html integration
    auditor.check_blog_html_integration()
    
    # Generate report
    score = auditor.generate_report()
    
    # Save report to file
    report_file = auditor.base_path / "blog_qa_report.txt"
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(f"Blog QA Audit Report - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("="*80 + "\n\n")
        f.write(f"High Priority Issues: {len(auditor.issues['high'])}\n")
        f.write(f"Medium Priority Issues: {len(auditor.issues['medium'])}\n")
        f.write(f"Low Priority Issues: {len(auditor.issues['low'])}\n")
        f.write(f"Launch Readiness Score: {score}/10\n")
    
    print(f"\n✅ Report saved to: {report_file}")