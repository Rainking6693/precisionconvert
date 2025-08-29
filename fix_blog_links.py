#!/usr/bin/env python3
"""
Automatic fix script for blog post broken links
"""

import os
from pathlib import Path

def fix_broken_links():
    base_path = Path("C:/Users/Ben/OneDrive/Documents/GitHub/precisionconvert")
    blog_dir = base_path / "content" / "blog"
    
    # Define link replacements
    replacements = {
        '/historical-unit-converter': '/index.html#converter',
        '/batch-unit-converter': '/index.html#converter',
        '/custom-unit-converter': '/index.html#converter'
    }
    
    fixed_files = []
    
    # Process each blog post
    for md_file in blog_dir.glob("*.md"):
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply replacements
        for old_link, new_link in replacements.items():
            if old_link in content:
                content = content.replace(f']({old_link})', f']({new_link})')
                print(f"Fixed links in {md_file.name}: {old_link} -> {new_link}")
        
        # Write back if changed
        if content != original_content:
            with open(md_file, 'w', encoding='utf-8') as f:
                f.write(content)
            fixed_files.append(md_file.name)
    
    return fixed_files

if __name__ == "__main__":
    print("Fixing broken links in blog posts...")
    fixed = fix_broken_links()
    
    if fixed:
        print(f"\n✅ Fixed {len(fixed)} files:")
        for f in fixed:
            print(f"   - {f}")
    else:
        print("\n✅ No broken links found to fix!")
    
    print("\n📝 Next steps:")
    print("1. Create og-images directory with placeholder images")
    print("2. Update blog.html to include the new blog posts")
    print("3. Re-run the QA audit to verify fixes")