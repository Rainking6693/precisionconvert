#!/usr/bin/env python3
"""
Blog Deployment QA Test Suite for PrecisionConvert.io
Comprehensive validation of blog deployment functionality
Author: Nathan (QA Tester)
Date: 2025-08-29
"""

import requests
import time
import json
from urllib.parse import urljoin
from bs4 import BeautifulSoup
import re
from datetime import datetime

class BlogDeploymentQA:
    def __init__(self):
        self.base_url = "https://precisionconvert.io"
        self.blog_posts = [
            "scientific-unit-converter",
            "cooking-unit-converter", 
            "batch-unit-conversion-save-hours",
            "convert-ancient-units-accurately",
            "custom-unit-converter-build-save-share"
        ]
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "overall_status": "PENDING",
            "url_tests": {},
            "navigation_tests": {},
            "content_validation": {},
            "performance_metrics": {},
            "issues": [],
            "recommendations": []
        }
        
    def test_url_status_codes(self):
        """Test all blog post URLs for HTTP status codes"""
        print("🔍 Testing URL Status Codes...")
        
        # Test main blog index
        blog_url = f"{self.base_url}/blog"
        try:
            response = requests.get(blog_url, timeout=10)
            self.results["url_tests"]["blog_index"] = {
                "url": blog_url,
                "status_code": response.status_code,
                "response_time": response.elapsed.total_seconds(),
                "status": "PASS" if response.status_code == 200 else "FAIL"
            }
        except Exception as e:
            self.results["url_tests"]["blog_index"] = {
                "url": blog_url,
                "status_code": "ERROR",
                "error": str(e),
                "status": "FAIL"
            }
            
        # Test individual blog posts
        for post in self.blog_posts:
            url = f"{self.base_url}/{post}"
            try:
                response = requests.get(url, timeout=10)
                self.results["url_tests"][post] = {
                    "url": url,
                    "status_code": response.status_code,
                    "response_time": response.elapsed.total_seconds(),
                    "content_length": len(response.content),
                    "status": "PASS" if response.status_code == 200 else "FAIL"
                }
                
                if response.status_code != 200:
                    self.results["issues"].append(f"❌ {post}: HTTP {response.status_code}")
                    
            except Exception as e:
                self.results["url_tests"][post] = {
                    "url": url,
                    "status_code": "ERROR", 
                    "error": str(e),
                    "status": "FAIL"
                }
                self.results["issues"].append(f"❌ {post}: Network error - {str(e)}")
                
    def test_navigation_links(self):
        """Test navigation between blog and main site"""
        print("🧭 Testing Navigation Links...")
        
        try:
            # Test main site blog link
            main_response = requests.get(self.base_url, timeout=10)
            if 'href="blog"' in main_response.text or 'href="/blog"' in main_response.text:
                self.results["navigation_tests"]["main_to_blog"] = "PASS"
            else:
                self.results["navigation_tests"]["main_to_blog"] = "FAIL"
                self.results["issues"].append("❌ Main site missing blog navigation link")
                
            # Test blog back to converter links
            blog_response = requests.get(f"{self.base_url}/blog", timeout=10)
            if 'converter' in blog_response.text.lower():
                self.results["navigation_tests"]["blog_to_converter"] = "PASS"
            else:
                self.results["navigation_tests"]["blog_to_converter"] = "FAIL"
                self.results["issues"].append("❌ Blog missing back to converter links")
                
        except Exception as e:
            self.results["navigation_tests"]["error"] = str(e)
            self.results["issues"].append(f"❌ Navigation test error: {str(e)}")
            
    def validate_content_structure(self):
        """Validate blog content structure and formatting"""
        print("📄 Validating Content Structure...")
        
        for post in self.blog_posts[:2]:  # Test first two posts for performance
            try:
                url = f"{self.base_url}/{post}"
                response = requests.get(url, timeout=10)
                
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    validation = {
                        "title_present": bool(soup.find('title')),
                        "meta_description": bool(soup.find('meta', attrs={'name': 'description'})),
                        "structured_data": '<script type="application/ld+json">' in response.text,
                        "h1_present": bool(soup.find('h1')),
                        "navigation_present": bool(soup.find('nav') or soup.find('a', href='blog.html')),
                        "responsive_meta": bool(soup.find('meta', attrs={'name': 'viewport'}))
                    }
                    
                    self.results["content_validation"][post] = validation
                    
                    # Check for issues
                    for check, passed in validation.items():
                        if not passed:
                            self.results["issues"].append(f"⚠️ {post}: Missing {check}")
                            
            except Exception as e:
                self.results["content_validation"][post] = {"error": str(e)}
                self.results["issues"].append(f"❌ {post}: Content validation error - {str(e)}")
                
    def check_performance_metrics(self):
        """Check basic performance metrics"""
        print("⚡ Checking Performance Metrics...")
        
        try:
            # Test blog index load time
            start_time = time.time()
            response = requests.get(f"{self.base_url}/blog", timeout=10)
            load_time = time.time() - start_time
            
            self.results["performance_metrics"] = {
                "blog_index_load_time": round(load_time, 3),
                "blog_index_size_kb": round(len(response.content) / 1024, 2),
                "load_time_status": "PASS" if load_time < 3.0 else "WARN"
            }
            
            if load_time > 5.0:
                self.results["issues"].append(f"⚠️ Blog index slow load time: {load_time:.2f}s")
                
        except Exception as e:
            self.results["performance_metrics"]["error"] = str(e)
            self.results["issues"].append(f"❌ Performance test error: {str(e)}")
            
    def generate_report(self):
        """Generate comprehensive QA report"""
        print("📊 Generating QA Report...")
        
        # Determine overall status
        total_tests = len(self.results["url_tests"])
        passed_tests = sum(1 for test in self.results["url_tests"].values() if test.get("status") == "PASS")
        
        if len(self.results["issues"]) == 0:
            self.results["overall_status"] = "PASS"
        elif passed_tests >= total_tests * 0.8:  # 80% pass rate
            self.results["overall_status"] = "PASS_WITH_WARNINGS"
        else:
            self.results["overall_status"] = "FAIL"
            
        # Add recommendations
        if self.results["overall_status"] != "PASS":
            self.results["recommendations"].extend([
                "Review failed URL tests and verify deployment configuration",
                "Check Netlify deployment logs for any errors",
                "Validate all internal links are using correct paths",
                "Test mobile responsiveness on actual devices"
            ])
            
        return self.results
        
    def run_full_test_suite(self):
        """Execute complete test suite"""
        print("🚀 Starting Blog Deployment QA Test Suite...")
        print("=" * 60)
        
        self.test_url_status_codes()
        self.test_navigation_links()
        self.validate_content_structure()
        self.check_performance_metrics()
        
        results = self.generate_report()
        
        # Save results to file
        with open('blog_qa_test_results.json', 'w') as f:
            json.dump(results, f, indent=2)
            
        return results

def main():
    """Main execution function"""
    qa_tester = BlogDeploymentQA()
    results = qa_tester.run_full_test_suite()
    
    print("\n📋 QA TEST RESULTS SUMMARY")
    print("=" * 60)
    print(f"Overall Status: {results['overall_status']}")
    print(f"Timestamp: {results['timestamp']}")
    
    # URL Tests Summary
    print(f"\n🔗 URL Tests ({len(results['url_tests'])} total):")
    for name, test in results['url_tests'].items():
        status_icon = "✅" if test.get('status') == 'PASS' else "❌"
        print(f"  {status_icon} {name}: {test.get('status_code', 'ERROR')}")
        
    # Issues Summary
    if results['issues']:
        print(f"\n⚠️ Issues Found ({len(results['issues'])}):")
        for issue in results['issues']:
            print(f"  {issue}")
    else:
        print("\n✅ No issues found!")
        
    # Performance Summary
    if 'blog_index_load_time' in results.get('performance_metrics', {}):
        load_time = results['performance_metrics']['blog_index_load_time']
        print(f"\n⚡ Performance: Blog loads in {load_time}s")
        
    print(f"\n📄 Full results saved to: blog_qa_test_results.json")
    print("=" * 60)
    
    return results['overall_status']

if __name__ == "__main__":
    main()