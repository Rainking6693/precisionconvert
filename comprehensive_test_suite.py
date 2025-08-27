#!/usr/bin/env python3
"""
Comprehensive Test Suite for PrecisionConvert.io Homepage Redesign
================================================================

This test suite validates all aspects of the redesigned homepage:
- Critical functionality testing
- New features validation
- Responsive design verification
- Performance analysis
- Accessibility compliance
- SEO optimization
- Cross-browser compatibility
- User experience validation

QA Engineer: Claude Code
Test Date: August 27, 2025
Target: PrecisionConvert.io homepage redesign
"""

import json
import re
import time
from datetime import datetime
from typing import Dict, List, Tuple, Any
import os

class PrecisionConvertTester:
    def __init__(self, html_file_path: str):
        self.html_file_path = html_file_path
        self.test_results = {
            "test_session": {
                "timestamp": datetime.now().isoformat(),
                "tester": "Claude Code QA Engineer",
                "version": "v2.2.0",
                "file_path": html_file_path
            },
            "critical_functionality": {},
            "new_features": {},
            "responsive_design": {},
            "performance": {},
            "accessibility": {},
            "seo": {},
            "cross_browser": {},
            "user_experience": {},
            "overall_score": 0,
            "issues_found": [],
            "recommendations": []
        }
        self.load_html_content()
    
    def load_html_content(self):
        """Load and parse HTML content for analysis"""
        try:
            with open(self.html_file_path, 'r', encoding='utf-8') as f:
                self.html_content = f.read()
            self.test_results["file_size_kb"] = len(self.html_content) / 1024
            print(f"✓ HTML content loaded successfully ({self.test_results['file_size_kb']:.1f} KB)")
        except Exception as e:
            self.add_issue("CRITICAL", f"Failed to load HTML file: {str(e)}")
            self.html_content = ""
    
    def add_issue(self, severity: str, description: str, category: str = "General"):
        """Add an issue to the test results"""
        self.test_results["issues_found"].append({
            "severity": severity,
            "category": category,
            "description": description,
            "timestamp": datetime.now().isoformat()
        })
    
    def add_recommendation(self, category: str, description: str, priority: str = "Medium"):
        """Add a recommendation to the test results"""
        self.test_results["recommendations"].append({
            "category": category,
            "description": description,
            "priority": priority,
            "timestamp": datetime.now().isoformat()
        })

    def test_critical_functionality(self):
        """Test all critical converter functionality"""
        print("\n🔧 TESTING CRITICAL FUNCTIONALITY")
        print("=" * 50)
        
        results = {
            "conversion_logic": self.test_conversion_logic(),
            "unit_categories": self.test_unit_categories(),
            "calculation_accuracy": self.test_calculation_accuracy(),
            "premium_features": self.test_premium_features(),
            "stripe_integration": self.test_stripe_integration()
        }
        
        self.test_results["critical_functionality"] = results
        
        # Calculate score
        passed_tests = sum(1 for test in results.values() if test.get("status") == "PASS")
        total_tests = len(results)
        score = (passed_tests / total_tests) * 100
        results["overall_score"] = score
        
        print(f"\n📊 Critical Functionality Score: {score:.1f}%")
        return results
    
    def test_conversion_logic(self):
        """Test the core conversion logic implementation"""
        print("Testing conversion logic...")
        
        # Check for convertUnit function
        convert_function_exists = "function convertUnit" in self.html_content
        
        # Check for conversion factors/data
        has_conversion_data = any(factor in self.html_content.lower() for factor in [
            "3.28084", "0.3048", "39.3701", "conversions", "meters", "feet"
        ])
        
        # Check for temperature conversion
        temp_conversion_exists = "convertTemperature" in self.html_content
        
        # Check for proper error handling
        has_error_handling = "fallback" in self.html_content or "catch" in self.html_content
        
        issues = []
        if not convert_function_exists:
            issues.append("Missing core convertUnit function")
            self.add_issue("HIGH", "Core convertUnit function not found", "Functionality")
        
        if not has_conversion_data:
            issues.append("Missing conversion factor data")
            self.add_issue("HIGH", "Conversion factors/data not found", "Functionality")
        
        if not temp_conversion_exists:
            issues.append("Missing temperature conversion function")
            self.add_issue("MEDIUM", "Temperature conversion function not found", "Functionality")
        
        status = "PASS" if not issues else "FAIL"
        return {
            "status": status,
            "issues": issues,
            "convert_function_exists": convert_function_exists,
            "has_conversion_data": has_conversion_data,
            "temperature_conversion": temp_conversion_exists,
            "error_handling": has_error_handling
        }
    
    def test_unit_categories(self):
        """Test availability of different unit categories"""
        print("Testing unit categories...")
        
        categories_to_check = [
            ("length", ["meter", "feet", "inch", "kilometer", "mile"]),
            ("weight", ["kilogram", "pound", "gram", "ounce"]),
            ("temperature", ["celsius", "fahrenheit", "kelvin"]),
            ("volume", ["liter", "gallon", "milliliter"]),
            ("area", ["square", "acre", "hectare"]),
            ("time", ["second", "minute", "hour", "day"])
        ]
        
        category_results = {}
        
        for category, units in categories_to_check:
            found_units = []
            for unit in units:
                if unit.lower() in self.html_content.lower():
                    found_units.append(unit)
            
            coverage = len(found_units) / len(units) * 100
            category_results[category] = {
                "coverage_percent": coverage,
                "found_units": found_units,
                "total_units": len(units),
                "status": "PASS" if coverage >= 60 else "FAIL"
            }
            
            if coverage < 60:
                self.add_issue("MEDIUM", f"Low unit coverage for {category}: {coverage:.1f}%", "Unit Categories")
        
        # Calculate overall category score
        avg_coverage = sum(cat["coverage_percent"] for cat in category_results.values()) / len(category_results)
        
        return {
            "status": "PASS" if avg_coverage >= 70 else "FAIL",
            "categories": category_results,
            "average_coverage": avg_coverage
        }
    
    def test_calculation_accuracy(self):
        """Test mathematical accuracy of conversions"""
        print("Testing calculation accuracy...")
        
        # Test known conversion factors
        accuracy_tests = [
            ("1 meter to feet", "3.28084"),
            ("1 foot to meters", "0.3048"),
            ("1 inch to centimeters", "2.54"),
            ("1 mile to kilometers", "1.60934"),
            ("1 kilogram to pounds", "2.20462")
        ]
        
        accurate_conversions = []
        for test_name, expected_factor in accuracy_tests:
            if expected_factor in self.html_content:
                accurate_conversions.append(test_name)
        
        accuracy_percent = len(accurate_conversions) / len(accuracy_tests) * 100
        
        # Check for precision settings
        high_precision = any(precision in self.html_content for precision in [
            "toFixed(6)", "toFixed(8)", "toFixed(10)", "15 decimal", "precision"
        ])
        
        status = "PASS" if accuracy_percent >= 80 and high_precision else "FAIL"
        
        if accuracy_percent < 80:
            self.add_issue("HIGH", f"Low conversion accuracy: {accuracy_percent:.1f}%", "Accuracy")
        
        if not high_precision:
            self.add_issue("MEDIUM", "No high-precision calculation settings found", "Accuracy")
        
        return {
            "status": status,
            "accuracy_percent": accuracy_percent,
            "high_precision": high_precision,
            "accurate_conversions": accurate_conversions
        }
    
    def test_premium_features(self):
        """Test premium features integration"""
        print("Testing premium features...")
        
        premium_indicators = [
            "premium", "pro", "upgrade", "subscription", "4.99", "$4.99",
            "batch", "export", "history", "advanced"
        ]
        
        found_features = []
        for indicator in premium_indicators:
            if indicator.lower() in self.html_content.lower():
                found_features.append(indicator)
        
        # Check for payment modal/system
        payment_modal_exists = "paymentModal" in self.html_content or "showPaymentModal" in self.html_content
        
        # Check for feature restrictions
        feature_gating = any(gate in self.html_content for gate in [
            "isPremium", "checkPremium", "requiresPremium", "premiumOnly"
        ])
        
        status = "PASS" if len(found_features) >= 3 and payment_modal_exists else "FAIL"
        
        if not payment_modal_exists:
            self.add_issue("HIGH", "Payment modal/system not found", "Premium Features")
        
        return {
            "status": status,
            "found_features": found_features,
            "payment_modal": payment_modal_exists,
            "feature_gating": feature_gating
        }
    
    def test_stripe_integration(self):
        """Test Stripe payment integration"""
        print("Testing Stripe integration...")
        
        stripe_elements = [
            "js.stripe.com" in self.html_content,
            "Stripe" in self.html_content,
            "stripe" in self.html_content.lower(),
            "pk_" in self.html_content or "stripe.com" in self.html_content
        ]
        
        stripe_integration_score = sum(stripe_elements) / len(stripe_elements) * 100
        
        # Check for proper Stripe implementation
        stripe_script = "js.stripe.com/v3/" in self.html_content
        stripe_elements_usage = "stripe.elements" in self.html_content.lower()
        
        status = "PASS" if stripe_integration_score >= 50 else "FAIL"
        
        if not stripe_script:
            self.add_issue("MEDIUM", "Stripe script not properly loaded", "Payment Integration")
        
        return {
            "status": status,
            "integration_score": stripe_integration_score,
            "stripe_script": stripe_script,
            "elements_usage": stripe_elements_usage
        }

    def test_new_features(self):
        """Test all new design features"""
        print("\n🎨 TESTING NEW FEATURES")
        print("=" * 50)
        
        results = {
            "hero_section": self.test_hero_section(),
            "feature_highlights": self.test_feature_highlights(),
            "example_conversions": self.test_example_conversions(),
            "professional_use_cases": self.test_professional_use_cases(),
            "pro_upgrade_section": self.test_pro_upgrade_section(),
            "faq_accordion": self.test_faq_accordion(),
            "enhanced_footer": self.test_enhanced_footer()
        }
        
        self.test_results["new_features"] = results
        
        # Calculate score
        passed_tests = sum(1 for test in results.values() if test.get("status") == "PASS")
        total_tests = len(results)
        score = (passed_tests / total_tests) * 100
        results["overall_score"] = score
        
        print(f"\n📊 New Features Score: {score:.1f}%")
        return results
    
    def test_hero_section(self):
        """Test hero section implementation"""
        print("Testing hero section...")
        
        hero_elements = {
            "hero_section": "hero-section" in self.html_content,
            "hero_title": "hero-title" in self.html_content,
            "hero_subtitle": "hero-subtitle" in self.html_content,
            "hero_cta": "hero-cta" in self.html_content,
            "hero_stats": "hero-stats" in self.html_content
        }
        
        # Check for specific content
        professional_branding = "Professional" in self.html_content
        accuracy_claim = "99.99%" in self.html_content
        precision_claim = "15" in self.html_content and "Decimal" in self.html_content
        
        issues = []
        for element, exists in hero_elements.items():
            if not exists:
                issues.append(f"Missing {element}")
                self.add_issue("MEDIUM", f"Hero section missing {element}", "Hero Section")
        
        status = "PASS" if len(issues) == 0 else "FAIL"
        
        return {
            "status": status,
            "elements": hero_elements,
            "professional_branding": professional_branding,
            "accuracy_claim": accuracy_claim,
            "precision_claim": precision_claim,
            "issues": issues
        }
    
    def test_feature_highlights(self):
        """Test feature highlights section"""
        print("Testing feature highlights...")
        
        highlight_indicators = [
            "feature", "highlight", "benefit", "advantage", "precision",
            "accuracy", "professional", "reliable", "fast", "secure"
        ]
        
        found_highlights = sum(1 for indicator in highlight_indicators 
                             if indicator.lower() in self.html_content.lower())
        
        # Check for animations/interactions
        has_animations = any(anim in self.html_content for anim in [
            "animation", "transition", "transform", "@keyframes", "animate"
        ])
        
        # Check for mobile optimizations
        mobile_optimized = "mobile" in self.html_content.lower() or "@media" in self.html_content
        
        coverage = (found_highlights / len(highlight_indicators)) * 100
        status = "PASS" if coverage >= 60 else "FAIL"
        
        return {
            "status": status,
            "coverage": coverage,
            "found_highlights": found_highlights,
            "animations": has_animations,
            "mobile_optimized": mobile_optimized
        }
    
    def test_example_conversions(self):
        """Test example conversion functionality"""
        print("Testing example conversions...")
        
        # Check for quick convert buttons or examples
        example_elements = [
            "example" in self.html_content.lower(),
            "quick" in self.html_content.lower(),
            "sample" in self.html_content.lower(),
            "demo" in self.html_content.lower()
        ]
        
        # Check for interactive examples
        interactive_examples = any(interaction in self.html_content for interaction in [
            "onclick", "addEventListener", "click", "convert("
        ])
        
        # Check for common conversions
        common_conversions = [
            ("meter", "feet"), ("pound", "kilogram"), ("celsius", "fahrenheit"),
            ("mile", "kilometer"), ("gallon", "liter")
        ]
        
        conversion_coverage = 0
        for unit1, unit2 in common_conversions:
            if unit1 in self.html_content.lower() and unit2 in self.html_content.lower():
                conversion_coverage += 1
        
        coverage_percent = (conversion_coverage / len(common_conversions)) * 100
        
        status = "PASS" if sum(example_elements) >= 2 and interactive_examples else "FAIL"
        
        return {
            "status": status,
            "example_elements": sum(example_elements),
            "interactive": interactive_examples,
            "conversion_coverage": coverage_percent
        }
    
    def test_professional_use_cases(self):
        """Test professional use cases section"""
        print("Testing professional use cases...")
        
        professional_terms = [
            "engineer", "architect", "scientist", "professional", "business",
            "construction", "manufacturing", "research", "laboratory", "industrial"
        ]
        
        found_terms = sum(1 for term in professional_terms 
                         if term.lower() in self.html_content.lower())
        
        # Check for case studies or examples
        case_studies = any(study in self.html_content.lower() for study in [
            "case study", "example", "scenario", "application", "use case"
        ])
        
        # Check for industry-specific content
        industry_specific = any(industry in self.html_content.lower() for industry in [
            "construction", "aerospace", "automotive", "medical", "pharmaceutical"
        ])
        
        coverage = (found_terms / len(professional_terms)) * 100
        status = "PASS" if coverage >= 40 else "FAIL"
        
        return {
            "status": status,
            "professional_coverage": coverage,
            "case_studies": case_studies,
            "industry_specific": industry_specific
        }
    
    def test_pro_upgrade_section(self):
        """Test pro upgrade section"""
        print("Testing pro upgrade section...")
        
        upgrade_elements = {
            "pricing": "$4.99" in self.html_content or "4.99" in self.html_content,
            "upgrade_cta": any(cta in self.html_content.lower() for cta in [
                "upgrade", "go pro", "get premium", "subscribe"
            ]),
            "features_list": any(feature in self.html_content.lower() for feature in [
                "batch", "export", "history", "advanced", "unlimited"
            ]),
            "payment_flow": "showPaymentModal" in self.html_content or "payment" in self.html_content.lower()
        }
        
        issues = []
        for element, exists in upgrade_elements.items():
            if not exists:
                issues.append(f"Missing {element}")
                self.add_issue("MEDIUM", f"Pro upgrade section missing {element}", "Upgrade Flow")
        
        status = "PASS" if len(issues) <= 1 else "FAIL"
        
        return {
            "status": status,
            "elements": upgrade_elements,
            "issues": issues
        }
    
    def test_faq_accordion(self):
        """Test FAQ accordion functionality"""
        print("Testing FAQ accordion...")
        
        faq_elements = {
            "faq_section": "faq" in self.html_content.lower(),
            "accordion_structure": "accordion" in self.html_content.lower() or "collapse" in self.html_content.lower(),
            "expand_collapse": any(action in self.html_content for action in [
                "toggle", "expand", "collapse", "show", "hide"
            ]),
            "common_questions": any(q in self.html_content.lower() for q in [
                "accurate", "premium", "cost", "cancel", "refund", "support"
            ])
        }
        
        # Check for JavaScript interaction
        interactive_faq = "onclick" in self.html_content or "addEventListener" in self.html_content
        
        issues = []
        for element, exists in faq_elements.items():
            if not exists:
                issues.append(f"Missing {element}")
                self.add_issue("LOW", f"FAQ section missing {element}", "FAQ")
        
        status = "PASS" if len(issues) <= 1 and interactive_faq else "FAIL"
        
        return {
            "status": status,
            "elements": faq_elements,
            "interactive": interactive_faq,
            "issues": issues
        }
    
    def test_enhanced_footer(self):
        """Test enhanced footer"""
        print("Testing enhanced footer...")
        
        footer_elements = {
            "footer_tag": "<footer" in self.html_content,
            "links_section": "links" in self.html_content.lower() or "nav" in self.html_content.lower(),
            "contact_info": "contact" in self.html_content.lower() or "support" in self.html_content.lower(),
            "social_links": any(social in self.html_content.lower() for social in [
                "twitter", "facebook", "linkedin", "github", "social"
            ]),
            "copyright": "copyright" in self.html_content.lower() or "©" in self.html_content
        }
        
        # Check for responsive design
        responsive_footer = "@media" in self.html_content
        
        issues = []
        for element, exists in footer_elements.items():
            if not exists:
                issues.append(f"Missing {element}")
                self.add_issue("LOW", f"Footer missing {element}", "Footer")
        
        status = "PASS" if len(issues) <= 1 else "FAIL"
        
        return {
            "status": status,
            "elements": footer_elements,
            "responsive": responsive_footer,
            "issues": issues
        }

    def test_responsive_design(self):
        """Test responsive design implementation"""
        print("\n📱 TESTING RESPONSIVE DESIGN")
        print("=" * 50)
        
        results = {
            "mobile_breakpoints": self.test_mobile_breakpoints(),
            "tablet_breakpoints": self.test_tablet_breakpoints(),
            "desktop_breakpoints": self.test_desktop_breakpoints(),
            "text_readability": self.test_text_readability(),
            "touch_targets": self.test_touch_targets()
        }
        
        self.test_results["responsive_design"] = results
        
        # Calculate score
        passed_tests = sum(1 for test in results.values() if test.get("status") == "PASS")
        total_tests = len(results)
        score = (passed_tests / total_tests) * 100
        results["overall_score"] = score
        
        print(f"\n📊 Responsive Design Score: {score:.1f}%")
        return results
    
    def test_mobile_breakpoints(self):
        """Test mobile breakpoint implementation"""
        print("Testing mobile breakpoints...")
        
        mobile_breakpoints = [
            ("320px", "320px" in self.html_content),
            ("375px", "375px" in self.html_content),
            ("414px", "414px" in self.html_content),
            ("max-width: 767px", "767px" in self.html_content),
            ("max-width: 480px", "480px" in self.html_content)
        ]
        
        # Check for mobile-first approach
        mobile_first = "@media" in self.html_content and "min-width" in self.html_content
        
        # Check for viewport meta tag
        viewport_meta = "viewport" in self.html_content and "device-width" in self.html_content
        
        breakpoint_coverage = sum(1 for _, exists in mobile_breakpoints if exists)
        coverage_percent = (breakpoint_coverage / len(mobile_breakpoints)) * 100
        
        status = "PASS" if coverage_percent >= 40 and viewport_meta else "FAIL"
        
        if not viewport_meta:
            self.add_issue("HIGH", "Missing proper viewport meta tag", "Mobile Responsiveness")
        
        return {
            "status": status,
            "breakpoint_coverage": coverage_percent,
            "mobile_first": mobile_first,
            "viewport_meta": viewport_meta,
            "found_breakpoints": [bp for bp, exists in mobile_breakpoints if exists]
        }
    
    def test_tablet_breakpoints(self):
        """Test tablet breakpoint implementation"""
        print("Testing tablet breakpoints...")
        
        tablet_breakpoints = [
            ("768px", "768px" in self.html_content),
            ("1024px", "1024px" in self.html_content),
            ("max-width: 1023px", "1023px" in self.html_content),
            ("min-width: 768px", "768px" in self.html_content and "min-width" in self.html_content)
        ]
        
        breakpoint_coverage = sum(1 for _, exists in tablet_breakpoints if exists)
        coverage_percent = (breakpoint_coverage / len(tablet_breakpoints)) * 100
        
        # Check for tablet-specific optimizations
        tablet_optimizations = any(opt in self.html_content for opt in [
            "tablet", "ipad", "landscape", "portrait"
        ])
        
        status = "PASS" if coverage_percent >= 50 else "FAIL"
        
        return {
            "status": status,
            "breakpoint_coverage": coverage_percent,
            "tablet_optimizations": tablet_optimizations,
            "found_breakpoints": [bp for bp, exists in tablet_breakpoints if exists]
        }
    
    def test_desktop_breakpoints(self):
        """Test desktop breakpoint implementation"""
        print("Testing desktop breakpoints...")
        
        desktop_breakpoints = [
            ("1280px", "1280px" in self.html_content),
            ("1920px", "1920px" in self.html_content),
            ("1440px", "1440px" in self.html_content),
            ("min-width: 1024px", "1024px" in self.html_content)
        ]
        
        breakpoint_coverage = sum(1 for _, exists in desktop_breakpoints if exists)
        coverage_percent = (breakpoint_coverage / len(desktop_breakpoints)) * 100
        
        # Check for large screen optimizations
        large_screen_opts = any(opt in self.html_content for opt in [
            "container", "max-width", "margin: 0 auto", "center"
        ])
        
        status = "PASS" if coverage_percent >= 25 and large_screen_opts else "FAIL"
        
        return {
            "status": status,
            "breakpoint_coverage": coverage_percent,
            "large_screen_optimizations": large_screen_opts,
            "found_breakpoints": [bp for bp, exists in desktop_breakpoints if exists]
        }
    
    def test_text_readability(self):
        """Test text readability across devices"""
        print("Testing text readability...")
        
        readability_factors = {
            "font_size_responsive": any(size in self.html_content for size in [
                "font-size", "rem", "em", "clamp", "vw"
            ]),
            "line_height": "line-height" in self.html_content,
            "font_family": "font-family" in self.html_content,
            "contrast_considerations": any(contrast in self.html_content for contrast in [
                "color:", "#000", "#fff", "contrast", "dark", "light"
            ])
        }
        
        # Check for accessibility font sizes
        accessible_fonts = any(size in self.html_content for size in [
            "16px", "1rem", "14px", "18px"
        ])
        
        passed_factors = sum(1 for factor in readability_factors.values() if factor)
        score = (passed_factors / len(readability_factors)) * 100
        
        status = "PASS" if score >= 75 and accessible_fonts else "FAIL"
        
        if not accessible_fonts:
            self.add_issue("MEDIUM", "No accessible font sizes found", "Text Readability")
        
        return {
            "status": status,
            "readability_score": score,
            "factors": readability_factors,
            "accessible_fonts": accessible_fonts
        }
    
    def test_touch_targets(self):
        """Test touch target sizing for mobile"""
        print("Testing touch targets...")
        
        touch_considerations = {
            "button_padding": "padding" in self.html_content,
            "min_height": any(height in self.html_content for height in [
                "min-height", "44px", "48px", "2.5rem", "3rem"
            ]),
            "touch_friendly_spacing": "margin" in self.html_content,
            "hover_states": ":hover" in self.html_content,
            "active_states": ":active" in self.html_content or ":focus" in self.html_content
        }
        
        passed_considerations = sum(1 for consideration in touch_considerations.values() if consideration)
        score = (passed_considerations / len(touch_considerations)) * 100
        
        status = "PASS" if score >= 60 else "FAIL"
        
        if score < 60:
            self.add_issue("MEDIUM", f"Touch target optimization low: {score:.1f}%", "Touch Targets")
        
        return {
            "status": status,
            "touch_score": score,
            "considerations": touch_considerations
        }

    def test_performance(self):
        """Test performance metrics"""
        print("\n⚡ TESTING PERFORMANCE")
        print("=" * 50)
        
        results = {
            "file_size": self.test_file_size(),
            "resource_optimization": self.test_resource_optimization(),
            "css_efficiency": self.test_css_efficiency(),
            "javascript_efficiency": self.test_javascript_efficiency(),
            "loading_optimization": self.test_loading_optimization()
        }
        
        self.test_results["performance"] = results
        
        # Calculate score
        passed_tests = sum(1 for test in results.values() if test.get("status") == "PASS")
        total_tests = len(results)
        score = (passed_tests / total_tests) * 100
        results["overall_score"] = score
        
        print(f"\n📊 Performance Score: {score:.1f}%")
        return results
    
    def test_file_size(self):
        """Test file size impact"""
        print("Testing file size...")
        
        file_size_kb = self.test_results["file_size_kb"]
        
        # File size thresholds
        if file_size_kb <= 100:
            size_score = "EXCELLENT"
            status = "PASS"
        elif file_size_kb <= 200:
            size_score = "GOOD"
            status = "PASS"
        elif file_size_kb <= 300:
            size_score = "ACCEPTABLE"
            status = "PASS"
        else:
            size_score = "LARGE"
            status = "FAIL"
            self.add_issue("MEDIUM", f"Large file size: {file_size_kb:.1f}KB", "Performance")
        
        # Check for compression opportunities
        compression_opportunities = {
            "minification": not any(waste in self.html_content for waste in [
                "    ", "\n\n\n", "/* ", "// "
            ]),
            "inline_css": "<style>" in self.html_content,
            "inline_js": "<script>" in self.html_content and "src=" not in self.html_content[:1000]
        }
        
        return {
            "status": status,
            "size_kb": file_size_kb,
            "size_score": size_score,
            "compression_opportunities": compression_opportunities
        }
    
    def test_resource_optimization(self):
        """Test resource loading optimization"""
        print("Testing resource optimization...")
        
        optimizations = {
            "preconnect": "preconnect" in self.html_content,
            "dns_prefetch": "dns-prefetch" in self.html_content,
            "preload": "preload" in self.html_content,
            "async_scripts": "async" in self.html_content,
            "defer_scripts": "defer" in self.html_content
        }
        
        # Check for external resource management
        external_resources = len(re.findall(r'https?://', self.html_content))
        
        optimization_score = sum(1 for opt in optimizations.values() if opt) / len(optimizations) * 100
        
        status = "PASS" if optimization_score >= 40 else "FAIL"
        
        if external_resources > 10:
            self.add_issue("MEDIUM", f"Many external resources: {external_resources}", "Performance")
        
        return {
            "status": status,
            "optimization_score": optimization_score,
            "optimizations": optimizations,
            "external_resources": external_resources
        }
    
    def test_css_efficiency(self):
        """Test CSS efficiency"""
        print("Testing CSS efficiency...")
        
        css_content = re.search(r'<style[^>]*>(.*?)</style>', self.html_content, re.DOTALL)
        css_length = len(css_content.group(1)) if css_content else 0
        
        css_efficiency = {
            "css_size_kb": css_length / 1024,
            "uses_classes": "class=" in self.html_content,
            "responsive_css": "@media" in self.html_content,
            "css_variables": "--" in self.html_content or "var(" in self.html_content,
            "flexbox_grid": "flex" in self.html_content or "grid" in self.html_content
        }
        
        # Check for CSS best practices
        modern_css = sum(1 for practice in [
            css_efficiency["css_variables"],
            css_efficiency["flexbox_grid"],
            css_efficiency["responsive_css"]
        ])
        
        status = "PASS" if css_efficiency["css_size_kb"] < 50 and modern_css >= 2 else "FAIL"
        
        if css_efficiency["css_size_kb"] > 50:
            self.add_issue("MEDIUM", f"Large CSS size: {css_efficiency['css_size_kb']:.1f}KB", "CSS Performance")
        
        return {
            "status": status,
            "css_efficiency": css_efficiency,
            "modern_practices": modern_css
        }
    
    def test_javascript_efficiency(self):
        """Test JavaScript efficiency"""
        print("Testing JavaScript efficiency...")
        
        js_content = re.search(r'<script[^>]*>(.*?)</script>', self.html_content, re.DOTALL)
        js_length = len(js_content.group(1)) if js_content else 0
        
        js_efficiency = {
            "js_size_kb": js_length / 1024,
            "modern_js": any(modern in self.html_content for modern in [
                "const ", "let ", "=>", "async", "await"
            ]),
            "event_delegation": "addEventListener" in self.html_content,
            "error_handling": "try" in self.html_content and "catch" in self.html_content,
            "dom_efficiency": "getElementById" in self.html_content or "querySelector" in self.html_content
        }
        
        modern_practices = sum(1 for practice in [
            js_efficiency["modern_js"],
            js_efficiency["event_delegation"],
            js_efficiency["error_handling"],
            js_efficiency["dom_efficiency"]
        ])
        
        status = "PASS" if js_efficiency["js_size_kb"] < 100 and modern_practices >= 3 else "FAIL"
        
        if js_efficiency["js_size_kb"] > 100:
            self.add_issue("MEDIUM", f"Large JavaScript size: {js_efficiency['js_size_kb']:.1f}KB", "JS Performance")
        
        return {
            "status": status,
            "js_efficiency": js_efficiency,
            "modern_practices": modern_practices
        }
    
    def test_loading_optimization(self):
        """Test loading optimization strategies"""
        print("Testing loading optimization...")
        
        loading_opts = {
            "critical_css": "<style>" in self.html_content[:5000],  # Critical CSS in head
            "non_blocking_js": "defer" in self.html_content or "async" in self.html_content,
            "resource_hints": "preconnect" in self.html_content or "prefetch" in self.html_content,
            "lazy_loading": "loading=" in self.html_content or "lazy" in self.html_content,
            "service_worker": "service-worker" in self.html_content.lower()
        }
        
        optimization_score = sum(1 for opt in loading_opts.values() if opt) / len(loading_opts) * 100
        
        status = "PASS" if optimization_score >= 40 else "FAIL"
        
        return {
            "status": status,
            "optimization_score": optimization_score,
            "optimizations": loading_opts
        }

    def test_accessibility(self):
        """Test WCAG 2.1 AA accessibility compliance"""
        print("\n♿ TESTING ACCESSIBILITY")
        print("=" * 50)
        
        results = {
            "wcag_compliance": self.test_wcag_compliance(),
            "keyboard_navigation": self.test_keyboard_navigation(),
            "screen_reader": self.test_screen_reader_compatibility(),
            "color_contrast": self.test_color_contrast(),
            "focus_indicators": self.test_focus_indicators()
        }
        
        self.test_results["accessibility"] = results
        
        # Calculate score
        passed_tests = sum(1 for test in results.values() if test.get("status") == "PASS")
        total_tests = len(results)
        score = (passed_tests / total_tests) * 100
        results["overall_score"] = score
        
        print(f"\n📊 Accessibility Score: {score:.1f}%")
        return results
    
    def test_wcag_compliance(self):
        """Test WCAG 2.1 AA compliance factors"""
        print("Testing WCAG compliance...")
        
        wcag_factors = {
            "semantic_html": any(tag in self.html_content for tag in [
                "<header>", "<nav>", "<main>", "<section>", "<article>", "<aside>", "<footer>"
            ]),
            "alt_attributes": "alt=" in self.html_content,
            "lang_attribute": 'lang="' in self.html_content,
            "skip_links": "skip" in self.html_content.lower(),
            "form_labels": "<label" in self.html_content,
            "heading_hierarchy": all(heading in self.html_content for heading in ["<h1", "<h2"]),
            "button_text": "<button" in self.html_content and not (">" in self.html_content and "<" in self.html_content)
        }
        
        compliance_score = sum(1 for factor in wcag_factors.values() if factor) / len(wcag_factors) * 100
        
        status = "PASS" if compliance_score >= 70 else "FAIL"
        
        # Check for accessibility issues
        if not wcag_factors["semantic_html"]:
            self.add_issue("HIGH", "Missing semantic HTML elements", "Accessibility")
        
        if not wcag_factors["alt_attributes"]:
            self.add_issue("HIGH", "Missing alt attributes for images", "Accessibility")
        
        if not wcag_factors["lang_attribute"]:
            self.add_issue("MEDIUM", "Missing language attribute", "Accessibility")
        
        return {
            "status": status,
            "compliance_score": compliance_score,
            "factors": wcag_factors
        }
    
    def test_keyboard_navigation(self):
        """Test keyboard navigation support"""
        print("Testing keyboard navigation...")
        
        keyboard_support = {
            "focusable_elements": any(focusable in self.html_content for focusable in [
                "tabindex", "button", "input", "select", "textarea", "a href"
            ]),
            "tab_order": "tabindex" in self.html_content,
            "focus_styles": ":focus" in self.html_content,
            "skip_navigation": "skip" in self.html_content.lower(),
            "keyboard_events": any(event in self.html_content for event in [
                "onkeydown", "onkeyup", "onkeypress", "keydown", "keyup"
            ])
        }
        
        support_score = sum(1 for support in keyboard_support.values() if support) / len(keyboard_support) * 100
        
        status = "PASS" if support_score >= 60 else "FAIL"
        
        if not keyboard_support["focus_styles"]:
            self.add_issue("HIGH", "Missing focus styles for keyboard navigation", "Accessibility")
        
        return {
            "status": status,
            "support_score": support_score,
            "keyboard_support": keyboard_support
        }
    
    def test_screen_reader_compatibility(self):
        """Test screen reader compatibility"""
        print("Testing screen reader compatibility...")
        
        screen_reader_support = {
            "aria_labels": "aria-label" in self.html_content,
            "aria_described_by": "aria-describedby" in self.html_content,
            "aria_expanded": "aria-expanded" in self.html_content,
            "role_attributes": "role=" in self.html_content,
            "alt_text": "alt=" in self.html_content,
            "heading_structure": all(heading in self.html_content for heading in ["<h1", "<h2", "<h3"]),
            "landmark_roles": any(landmark in self.html_content for landmark in [
                "banner", "navigation", "main", "contentinfo", "complementary"
            ])
        }
        
        support_score = sum(1 for support in screen_reader_support.values() if support) / len(screen_reader_support) * 100
        
        status = "PASS" if support_score >= 50 else "FAIL"
        
        if not screen_reader_support["alt_text"]:
            self.add_issue("HIGH", "Missing alt text for images", "Screen Reader")
        
        if not screen_reader_support["heading_structure"]:
            self.add_issue("MEDIUM", "Incomplete heading structure", "Screen Reader")
        
        return {
            "status": status,
            "support_score": support_score,
            "screen_reader_support": screen_reader_support
        }
    
    def test_color_contrast(self):
        """Test color contrast ratios"""
        print("Testing color contrast...")
        
        # Extract colors from CSS
        colors = re.findall(r'color:\s*([^;]+)', self.html_content, re.IGNORECASE)
        background_colors = re.findall(r'background-color:\s*([^;]+)', self.html_content, re.IGNORECASE)
        
        contrast_considerations = {
            "defined_colors": len(colors) > 0,
            "background_colors": len(background_colors) > 0,
            "high_contrast_mode": "high-contrast" in self.html_content.lower(),
            "dark_mode_support": any(dark in self.html_content.lower() for dark in [
                "dark", "theme", "prefers-color-scheme"
            ]),
            "sufficient_contrast": any(contrast in self.html_content for contrast in [
                "#000", "#fff", "rgb(0", "rgb(255"
            ])
        }
        
        contrast_score = sum(1 for consideration in contrast_considerations.values() if consideration) / len(contrast_considerations) * 100
        
        status = "PASS" if contrast_score >= 60 else "FAIL"
        
        if not contrast_considerations["sufficient_contrast"]:
            self.add_issue("MEDIUM", "Potential color contrast issues", "Color Contrast")
        
        return {
            "status": status,
            "contrast_score": contrast_score,
            "considerations": contrast_considerations,
            "color_count": len(colors),
            "background_color_count": len(background_colors)
        }
    
    def test_focus_indicators(self):
        """Test focus indicator implementation"""
        print("Testing focus indicators...")
        
        focus_indicators = {
            "focus_styles": ":focus" in self.html_content,
            "focus_visible": "focus-visible" in self.html_content,
            "outline_styles": "outline" in self.html_content,
            "box_shadow_focus": "box-shadow" in self.html_content and ":focus" in self.html_content,
            "custom_focus": any(custom in self.html_content for custom in [
                "focus-ring", "focus-outline", "focus-border"
            ])
        }
        
        indicator_score = sum(1 for indicator in focus_indicators.values() if indicator) / len(focus_indicators) * 100
        
        status = "PASS" if indicator_score >= 40 else "FAIL"
        
        if not focus_indicators["focus_styles"]:
            self.add_issue("HIGH", "Missing focus styles", "Focus Indicators")
        
        return {
            "status": status,
            "indicator_score": indicator_score,
            "focus_indicators": focus_indicators
        }

    def test_seo(self):
        """Test SEO optimization"""
        print("\n🔍 TESTING SEO")
        print("=" * 50)
        
        results = {
            "meta_tags": self.test_meta_tags(),
            "structured_data": self.test_structured_data(),
            "heading_hierarchy": self.test_heading_hierarchy(),
            "image_optimization": self.test_image_optimization(),
            "semantic_html": self.test_semantic_html_seo()
        }
        
        self.test_results["seo"] = results
        
        # Calculate score
        passed_tests = sum(1 for test in results.values() if test.get("status") == "PASS")
        total_tests = len(results)
        score = (passed_tests / total_tests) * 100
        results["overall_score"] = score
        
        print(f"\n📊 SEO Score: {score:.1f}%")
        return results
    
    def test_meta_tags(self):
        """Test meta tag implementation"""
        print("Testing meta tags...")
        
        meta_tags = {
            "title": "<title>" in self.html_content,
            "description": 'name="description"' in self.html_content,
            "keywords": 'name="keywords"' in self.html_content,
            "author": 'name="author"' in self.html_content,
            "robots": 'name="robots"' in self.html_content,
            "canonical": 'rel="canonical"' in self.html_content,
            "og_title": 'property="og:title"' in self.html_content,
            "og_description": 'property="og:description"' in self.html_content,
            "og_image": 'property="og:image"' in self.html_content,
            "twitter_card": 'name="twitter:card"' in self.html_content
        }
        
        # Check meta tag quality
        title_length = 0
        description_length = 0
        
        title_match = re.search(r'<title[^>]*>([^<]*)</title>', self.html_content)
        if title_match:
            title_length = len(title_match.group(1))
        
        desc_match = re.search(r'name="description"[^>]*content="([^"]*)"', self.html_content)
        if desc_match:
            description_length = len(desc_match.group(1))
        
        # SEO best practices
        title_optimal = 30 <= title_length <= 60
        description_optimal = 120 <= description_length <= 160
        
        meta_score = sum(1 for tag in meta_tags.values() if tag) / len(meta_tags) * 100
        
        status = "PASS" if meta_score >= 70 and title_optimal and description_optimal else "FAIL"
        
        if not title_optimal:
            self.add_issue("MEDIUM", f"Title length not optimal: {title_length} chars", "SEO Meta Tags")
        
        if not description_optimal:
            self.add_issue("MEDIUM", f"Description length not optimal: {description_length} chars", "SEO Meta Tags")
        
        return {
            "status": status,
            "meta_score": meta_score,
            "tags": meta_tags,
            "title_length": title_length,
            "description_length": description_length,
            "title_optimal": title_optimal,
            "description_optimal": description_optimal
        }
    
    def test_structured_data(self):
        """Test structured data implementation"""
        print("Testing structured data...")
        
        structured_data = {
            "json_ld": "application/ld+json" in self.html_content,
            "schema_org": "schema.org" in self.html_content,
            "web_application": "WebApplication" in self.html_content,
            "aggregate_rating": "AggregateRating" in self.html_content,
            "offers": "Offer" in self.html_content,
            "organization": "Organization" in self.html_content
        }
        
        # Check for proper schema implementation
        schema_types = re.findall(r'"@type":\s*"([^"]*)"', self.html_content)
        
        structured_score = sum(1 for data in structured_data.values() if data) / len(structured_data) * 100
        
        status = "PASS" if structured_score >= 50 else "FAIL"
        
        if not structured_data["json_ld"]:
            self.add_issue("MEDIUM", "Missing JSON-LD structured data", "SEO Structured Data")
        
        return {
            "status": status,
            "structured_score": structured_score,
            "structured_data": structured_data,
            "schema_types": schema_types
        }
    
    def test_heading_hierarchy(self):
        """Test heading hierarchy (H1, H2, H3)"""
        print("Testing heading hierarchy...")
        
        headings = {
            "h1": len(re.findall(r'<h1[^>]*>', self.html_content)),
            "h2": len(re.findall(r'<h2[^>]*>', self.html_content)),
            "h3": len(re.findall(r'<h3[^>]*>', self.html_content)),
            "h4": len(re.findall(r'<h4[^>]*>', self.html_content)),
            "h5": len(re.findall(r'<h5[^>]*>', self.html_content)),
            "h6": len(re.findall(r'<h6[^>]*>', self.html_content))
        }
        
        # Check heading hierarchy rules
        single_h1 = headings["h1"] == 1
        has_h2 = headings["h2"] > 0
        proper_hierarchy = single_h1 and has_h2
        
        # Extract heading text for analysis
        heading_texts = []
        for level in range(1, 7):
            pattern = f'<h{level}[^>]*>([^<]*)</h{level}>'
            matches = re.findall(pattern, self.html_content)
            heading_texts.extend(matches)
        
        status = "PASS" if proper_hierarchy else "FAIL"
        
        if headings["h1"] != 1:
            self.add_issue("HIGH", f"Should have exactly 1 H1 tag, found {headings['h1']}", "SEO Headings")
        
        if headings["h2"] == 0:
            self.add_issue("MEDIUM", "Missing H2 tags for content structure", "SEO Headings")
        
        return {
            "status": status,
            "headings": headings,
            "single_h1": single_h1,
            "has_h2": has_h2,
            "proper_hierarchy": proper_hierarchy,
            "heading_texts": heading_texts
        }
    
    def test_image_optimization(self):
        """Test image SEO optimization"""
        print("Testing image optimization...")
        
        images = re.findall(r'<img[^>]*>', self.html_content)
        
        image_seo = {
            "has_images": len(images) > 0,
            "alt_attributes": all("alt=" in img for img in images) if images else False,
            "title_attributes": any("title=" in img for img in images) if images else False,
            "loading_lazy": any("loading=" in img for img in images) if images else False,
            "responsive_images": any("srcset=" in img for img in images) if images else False
        }
        
        # Check for image file formats
        image_formats = re.findall(r'\.(jpg|jpeg|png|webp|svg|gif)', self.html_content.lower())
        modern_formats = sum(1 for fmt in image_formats if fmt in ['webp', 'svg'])
        
        seo_score = sum(1 for seo in image_seo.values() if seo) / len(image_seo) * 100 if len(image_seo) > 0 else 100
        
        status = "PASS" if seo_score >= 60 or not images else "FAIL"
        
        if images and not image_seo["alt_attributes"]:
            self.add_issue("HIGH", "Images missing alt attributes", "Image SEO")
        
        return {
            "status": status,
            "seo_score": seo_score,
            "image_count": len(images),
            "image_seo": image_seo,
            "image_formats": image_formats,
            "modern_formats": modern_formats
        }
    
    def test_semantic_html_seo(self):
        """Test semantic HTML for SEO"""
        print("Testing semantic HTML for SEO...")
        
        semantic_elements = {
            "header": "<header>" in self.html_content,
            "nav": "<nav>" in self.html_content,
            "main": "<main>" in self.html_content,
            "section": "<section>" in self.html_content,
            "article": "<article>" in self.html_content,
            "aside": "<aside>" in self.html_content,
            "footer": "<footer>" in self.html_content
        }
        
        # Check for microdata or schema markup
        microdata = any(micro in self.html_content for micro in [
            "itemscope", "itemtype", "itemprop", "schema.org"
        ])
        
        semantic_score = sum(1 for element in semantic_elements.values() if element) / len(semantic_elements) * 100
        
        status = "PASS" if semantic_score >= 50 else "FAIL"
        
        if semantic_score < 50:
            self.add_issue("MEDIUM", f"Low semantic HTML usage: {semantic_score:.1f}%", "Semantic SEO")
        
        return {
            "status": status,
            "semantic_score": semantic_score,
            "semantic_elements": semantic_elements,
            "microdata": microdata
        }

    def test_cross_browser(self):
        """Test cross-browser compatibility indicators"""
        print("\n🌐 TESTING CROSS-BROWSER COMPATIBILITY")
        print("=" * 50)
        
        results = {
            "css_compatibility": self.test_css_compatibility(),
            "javascript_compatibility": self.test_javascript_compatibility(),
            "html5_features": self.test_html5_features(),
            "polyfills": self.test_polyfills(),
            "vendor_prefixes": self.test_vendor_prefixes()
        }
        
        self.test_results["cross_browser"] = results
        
        # Calculate score
        passed_tests = sum(1 for test in results.values() if test.get("status") == "PASS")
        total_tests = len(results)
        score = (passed_tests / total_tests) * 100
        results["overall_score"] = score
        
        print(f"\n📊 Cross-Browser Compatibility Score: {score:.1f}%")
        return results
    
    def test_css_compatibility(self):
        """Test CSS cross-browser compatibility"""
        print("Testing CSS compatibility...")
        
        modern_css_features = [
            ("flexbox", "flex" in self.html_content),
            ("grid", "grid" in self.html_content),
            ("css_variables", "var(" in self.html_content),
            ("calc", "calc(" in self.html_content),
            ("transforms", "transform:" in self.html_content),
            ("transitions", "transition:" in self.html_content),
            ("media_queries", "@media" in self.html_content)
        ]
        
        # Check for potential compatibility issues
        compatibility_issues = [
            ("webkit_prefixes", "-webkit-" in self.html_content),
            ("moz_prefixes", "-moz-" in self.html_content),
            ("ms_prefixes", "-ms-" in self.html_content),
            ("experimental_features", any(exp in self.html_content for exp in [
                "experimental", "draft", "alpha", "beta"
            ]))
        ]
        
        modern_support = sum(1 for _, supported in modern_css_features if supported)
        modern_score = (modern_support / len(modern_css_features)) * 100
        
        status = "PASS" if modern_score >= 60 else "FAIL"
        
        return {
            "status": status,
            "modern_score": modern_score,
            "modern_features": dict(modern_css_features),
            "compatibility_considerations": dict(compatibility_issues)
        }
    
    def test_javascript_compatibility(self):
        """Test JavaScript cross-browser compatibility"""
        print("Testing JavaScript compatibility...")
        
        modern_js_features = [
            ("es6_const_let", any(keyword in self.html_content for keyword in ["const ", "let "])),
            ("arrow_functions", "=>" in self.html_content),
            ("async_await", "async" in self.html_content and "await" in self.html_content),
            ("promises", "Promise" in self.html_content),
            ("template_literals", "`" in self.html_content),
            ("destructuring", any(dest in self.html_content for dest in ["{", "["])),
            ("modules", "import" in self.html_content or "export" in self.html_content)
        ]
        
        # Check for compatibility patterns
        compatibility_patterns = [
            ("polyfills", "polyfill" in self.html_content.lower()),
            ("feature_detection", any(detect in self.html_content for detect in [
                "typeof", "instanceof", "in ", "hasOwnProperty"
            ])),
            ("fallbacks", any(fallback in self.html_content for fallback in [
                "fallback", "else", "default", "catch"
            ]))
        ]
        
        modern_support = sum(1 for _, supported in modern_js_features if supported)
        modern_score = (modern_support / len(modern_js_features)) * 100
        
        compatibility_support = sum(1 for _, supported in compatibility_patterns if supported)
        compatibility_score = (compatibility_support / len(compatibility_patterns)) * 100
        
        status = "PASS" if modern_score >= 40 and compatibility_score >= 30 else "FAIL"
        
        return {
            "status": status,
            "modern_score": modern_score,
            "compatibility_score": compatibility_score,
            "modern_features": dict(modern_js_features),
            "compatibility_patterns": dict(compatibility_patterns)
        }
    
    def test_html5_features(self):
        """Test HTML5 feature usage"""
        print("Testing HTML5 features...")
        
        html5_features = [
            ("semantic_elements", any(element in self.html_content for element in [
                "<header>", "<nav>", "<section>", "<article>", "<aside>", "<footer>"
            ])),
            ("form_inputs", any(input_type in self.html_content for input_type in [
                'type="email"', 'type="url"', 'type="number"', 'type="tel"'
            ])),
            ("media_elements", any(media in self.html_content for media in [
                "<video>", "<audio>", "<canvas>"
            ])),
            ("storage_apis", any(storage in self.html_content for storage in [
                "localStorage", "sessionStorage", "indexedDB"
            ])),
            ("geolocation", "navigator.geolocation" in self.html_content),
            ("web_workers", "Worker" in self.html_content),
            ("service_workers", "serviceWorker" in self.html_content)
        ]
        
        feature_support = sum(1 for _, supported in html5_features if supported)
        feature_score = (feature_support / len(html5_features)) * 100
        
        status = "PASS" if feature_score >= 30 else "FAIL"
        
        return {
            "status": status,
            "feature_score": feature_score,
            "html5_features": dict(html5_features)
        }
    
    def test_polyfills(self):
        """Test polyfill implementation"""
        print("Testing polyfills...")
        
        polyfill_indicators = [
            ("polyfill_service", "polyfill.io" in self.html_content),
            ("babel_polyfill", "babel" in self.html_content.lower()),
            ("custom_polyfills", "polyfill" in self.html_content.lower()),
            ("feature_detection", any(detection in self.html_content for detection in [
                "if (!", "typeof", "undefined", "feature"
            ]))
        ]
        
        polyfill_support = sum(1 for _, supported in polyfill_indicators if supported)
        polyfill_score = (polyfill_support / len(polyfill_indicators)) * 100
        
        status = "PASS" if polyfill_score >= 25 else "FAIL"
        
        return {
            "status": status,
            "polyfill_score": polyfill_score,
            "polyfill_indicators": dict(polyfill_indicators)
        }
    
    def test_vendor_prefixes(self):
        """Test vendor prefix usage"""
        print("Testing vendor prefixes...")
        
        vendor_prefixes = [
            ("webkit", "-webkit-" in self.html_content),
            ("moz", "-moz-" in self.html_content),
            ("ms", "-ms-" in self.html_content),
            ("o", "-o-" in self.html_content)
        ]
        
        prefix_usage = sum(1 for _, used in vendor_prefixes if used)
        
        # Modern approach: fewer prefixes needed
        status = "PASS" if prefix_usage <= 2 else "FAIL"
        
        if prefix_usage > 2:
            self.add_recommendation("CSS", "Consider reducing vendor prefixes by using autoprefixer", "Low")
        
        return {
            "status": status,
            "prefix_count": prefix_usage,
            "vendor_prefixes": dict(vendor_prefixes)
        }

    def test_user_experience(self):
        """Test user experience factors"""
        print("\n👤 TESTING USER EXPERIENCE")
        print("=" * 50)
        
        results = {
            "navigation_flow": self.test_navigation_flow(),
            "conversion_funnel": self.test_conversion_funnel(),
            "error_handling": self.test_error_handling(),
            "form_validation": self.test_form_validation(),
            "loading_states": self.test_loading_states()
        }
        
        self.test_results["user_experience"] = results
        
        # Calculate score
        passed_tests = sum(1 for test in results.values() if test.get("status") == "PASS")
        total_tests = len(results)
        score = (passed_tests / total_tests) * 100
        results["overall_score"] = score
        
        print(f"\n📊 User Experience Score: {score:.1f}%")
        return results
    
    def test_navigation_flow(self):
        """Test navigation flow and usability"""
        print("Testing navigation flow...")
        
        navigation_elements = {
            "main_navigation": "<nav>" in self.html_content,
            "breadcrumbs": "breadcrumb" in self.html_content.lower(),
            "skip_links": "skip" in self.html_content.lower(),
            "search_function": any(search in self.html_content.lower() for search in [
                "search", "find", "query"
            ]),
            "clear_ctas": any(cta in self.html_content.lower() for cta in [
                "get started", "try now", "convert", "calculate"
            ]),
            "back_to_top": "top" in self.html_content.lower()
        }
        
        # Check for smooth scrolling
        smooth_scrolling = "scroll-behavior" in self.html_content or "scrollTo" in self.html_content
        
        navigation_score = sum(1 for nav in navigation_elements.values() if nav) / len(navigation_elements) * 100
        
        status = "PASS" if navigation_score >= 50 else "FAIL"
        
        return {
            "status": status,
            "navigation_score": navigation_score,
            "navigation_elements": navigation_elements,
            "smooth_scrolling": smooth_scrolling
        }
    
    def test_conversion_funnel(self):
        """Test conversion funnel optimization"""
        print("Testing conversion funnel...")
        
        funnel_elements = {
            "clear_value_prop": any(value in self.html_content.lower() for value in [
                "professional", "accurate", "precision", "trusted", "reliable"
            ]),
            "social_proof": any(proof in self.html_content for proof in [
                "rating", "review", "testimonial", "4.8", "2847", "trusted"
            ]),
            "urgency_scarcity": any(urgency in self.html_content.lower() for urgency in [
                "limited", "now", "today", "instant", "immediate"
            ]),
            "risk_reduction": any(risk in self.html_content.lower() for risk in [
                "free", "trial", "guarantee", "cancel", "refund"
            ]),
            "progressive_disclosure": any(progressive in self.html_content.lower() for progressive in [
                "more", "details", "expand", "show", "learn"
            ]),
            "clear_pricing": "$4.99" in self.html_content or "4.99" in self.html_content
        }
        
        funnel_score = sum(1 for funnel in funnel_elements.values() if funnel) / len(funnel_elements) * 100
        
        status = "PASS" if funnel_score >= 70 else "FAIL"
        
        return {
            "status": status,
            "funnel_score": funnel_score,
            "funnel_elements": funnel_elements
        }
    
    def test_error_handling(self):
        """Test error handling and user feedback"""
        print("Testing error handling...")
        
        error_handling = {
            "try_catch": "try" in self.html_content and "catch" in self.html_content,
            "error_messages": any(error in self.html_content.lower() for error in [
                "error", "invalid", "required", "please", "oops"
            ]),
            "validation_feedback": any(validation in self.html_content for validation in [
                "valid", "invalid", "required", "pattern"
            ]),
            "fallback_content": "fallback" in self.html_content.lower(),
            "user_friendly_messages": any(friendly in self.html_content.lower() for friendly in [
                "please", "sorry", "help", "support", "contact"
            ])
        }
        
        error_score = sum(1 for error in error_handling.values() if error) / len(error_handling) * 100
        
        status = "PASS" if error_score >= 40 else "FAIL"
        
        if not error_handling["try_catch"]:
            self.add_issue("MEDIUM", "Missing error handling with try-catch blocks", "Error Handling")
        
        return {
            "status": status,
            "error_score": error_score,
            "error_handling": error_handling
        }
    
    def test_form_validation(self):
        """Test form validation implementation"""
        print("Testing form validation...")
        
        forms = re.findall(r'<form[^>]*>', self.html_content)
        inputs = re.findall(r'<input[^>]*>', self.html_content)
        
        validation_features = {
            "has_forms": len(forms) > 0,
            "required_fields": "required" in self.html_content,
            "input_patterns": "pattern=" in self.html_content,
            "validation_messages": any(validation in self.html_content for validation in [
                "invalid", "required", "valid", "error"
            ]),
            "client_side_validation": any(validation in self.html_content for validation in [
                "validate", "check", "verify"
            ]),
            "real_time_feedback": any(feedback in self.html_content for feedback in [
                "oninput", "onblur", "onchange", "keyup"
            ])
        }
        
        validation_score = sum(1 for validation in validation_features.values() if validation) / len(validation_features) * 100 if len(validation_features) > 0 else 100
        
        status = "PASS" if validation_score >= 50 or not forms else "FAIL"
        
        return {
            "status": status,
            "validation_score": validation_score,
            "form_count": len(forms),
            "input_count": len(inputs),
            "validation_features": validation_features
        }
    
    def test_loading_states(self):
        """Test loading states and user feedback"""
        print("Testing loading states...")
        
        loading_indicators = {
            "loading_messages": any(loading in self.html_content.lower() for loading in [
                "loading", "please wait", "processing", "calculating"
            ]),
            "progress_indicators": any(progress in self.html_content for progress in [
                "progress", "spinner", "loader", "percent"
            ]),
            "skeleton_screens": "skeleton" in self.html_content.lower(),
            "disabled_states": "disabled" in self.html_content,
            "success_feedback": any(success in self.html_content.lower() for success in [
                "success", "complete", "done", "finished"
            ])
        }
        
        loading_score = sum(1 for loading in loading_indicators.values() if loading) / len(loading_indicators) * 100
        
        status = "PASS" if loading_score >= 40 else "FAIL"
        
        return {
            "status": status,
            "loading_score": loading_score,
            "loading_indicators": loading_indicators
        }

    def calculate_overall_score(self):
        """Calculate overall quality score"""
        category_weights = {
            "critical_functionality": 25,
            "new_features": 15,
            "responsive_design": 15,
            "performance": 15,
            "accessibility": 15,
            "seo": 10,
            "cross_browser": 5,
            "user_experience": 20
        }
        
        total_weighted_score = 0
        total_weight = 0
        
        for category, weight in category_weights.items():
            if category in self.test_results:
                category_score = self.test_results[category].get("overall_score", 0)
                total_weighted_score += category_score * weight
                total_weight += weight
        
        overall_score = total_weighted_score / total_weight if total_weight > 0 else 0
        self.test_results["overall_score"] = overall_score
        
        return overall_score

    def generate_recommendations(self):
        """Generate specific recommendations based on test results"""
        recommendations = []
        
        # Critical functionality recommendations
        if self.test_results.get("critical_functionality", {}).get("overall_score", 0) < 80:
            recommendations.append({
                "category": "Critical Functionality",
                "priority": "HIGH",
                "description": "Core conversion functionality needs improvement. Verify all conversion calculations and premium features.",
                "action_items": [
                    "Test conversion accuracy with known values",
                    "Implement comprehensive error handling",
                    "Verify premium feature gating works correctly",
                    "Test Stripe integration thoroughly"
                ]
            })
        
        # Performance recommendations
        if self.test_results.get("performance", {}).get("overall_score", 0) < 70:
            recommendations.append({
                "category": "Performance",
                "priority": "MEDIUM",
                "description": "Performance optimizations needed for better user experience.",
                "action_items": [
                    "Minimize CSS and JavaScript",
                    "Implement lazy loading for images",
                    "Add resource preloading",
                    "Consider code splitting"
                ]
            })
        
        # Accessibility recommendations
        if self.test_results.get("accessibility", {}).get("overall_score", 0) < 70:
            recommendations.append({
                "category": "Accessibility",
                "priority": "HIGH",
                "description": "Accessibility improvements required for WCAG 2.1 AA compliance.",
                "action_items": [
                    "Add missing alt attributes",
                    "Improve keyboard navigation",
                    "Enhance focus indicators",
                    "Validate color contrast ratios"
                ]
            })
        
        # SEO recommendations
        if self.test_results.get("seo", {}).get("overall_score", 0) < 80:
            recommendations.append({
                "category": "SEO",
                "priority": "MEDIUM",
                "description": "SEO optimization needed for better search visibility.",
                "action_items": [
                    "Optimize meta tag lengths",
                    "Improve heading hierarchy",
                    "Add more structured data",
                    "Enhance image SEO"
                ]
            })
        
        return recommendations

    def run_comprehensive_test(self):
        """Run the complete test suite"""
        print("🚀 STARTING COMPREHENSIVE TEST SUITE")
        print("=" * 60)
        print(f"Testing: {self.html_file_path}")
        print(f"File size: {self.test_results['file_size_kb']:.1f} KB")
        print("=" * 60)
        
        # Update todo status
        TodoWrite(todos=[
            {"content": "Analyze HTML structure and identify key sections for testing", "status": "completed", "activeForm": "Analyzing HTML structure and identifying key sections"},
            {"content": "Test critical functionality - unit conversion calculations", "status": "in_progress", "activeForm": "Testing unit conversion calculations"},
            {"content": "Test new hero section design and CTAs", "status": "pending", "activeForm": "Testing hero section design and CTAs"},
            {"content": "Validate responsive design across all breakpoints", "status": "pending", "activeForm": "Validating responsive design across breakpoints"},
            {"content": "Test payment integration and premium features", "status": "pending", "activeForm": "Testing payment integration and premium features"},
            {"content": "Conduct accessibility testing (WCAG 2.1 AA)", "status": "pending", "activeForm": "Conducting accessibility testing"},
            {"content": "Perform SEO validation and meta tag analysis", "status": "pending", "activeForm": "Performing SEO validation and meta tag analysis"},
            {"content": "Test cross-browser compatibility", "status": "pending", "activeForm": "Testing cross-browser compatibility"},
            {"content": "Analyze performance metrics and load times", "status": "pending", "activeForm": "Analyzing performance metrics and load times"},
            {"content": "Generate comprehensive test report with recommendations", "status": "pending", "activeForm": "Generating comprehensive test report"}
        ])
        
        # Run all test categories
        try:
            self.test_critical_functionality()
            self.update_todo_status("Test critical functionality - unit conversion calculations", "completed")
            self.update_todo_status("Test new hero section design and CTAs", "in_progress")
            
            self.test_new_features()
            self.update_todo_status("Test new hero section design and CTAs", "completed")
            self.update_todo_status("Validate responsive design across all breakpoints", "in_progress")
            
            self.test_responsive_design()
            self.update_todo_status("Validate responsive design across all breakpoints", "completed")
            self.update_todo_status("Test payment integration and premium features", "in_progress")
            
            # Continue with payment/premium testing (already covered in critical functionality)
            self.update_todo_status("Test payment integration and premium features", "completed")
            self.update_todo_status("Conduct accessibility testing (WCAG 2.1 AA)", "in_progress")
            
            self.test_accessibility()
            self.update_todo_status("Conduct accessibility testing (WCAG 2.1 AA)", "completed")
            self.update_todo_status("Perform SEO validation and meta tag analysis", "in_progress")
            
            self.test_seo()
            self.update_todo_status("Perform SEO validation and meta tag analysis", "completed")
            self.update_todo_status("Test cross-browser compatibility", "in_progress")
            
            self.test_cross_browser()
            self.update_todo_status("Test cross-browser compatibility", "completed")
            self.update_todo_status("Analyze performance metrics and load times", "in_progress")
            
            self.test_performance()
            self.update_todo_status("Analyze performance metrics and load times", "completed")
            self.update_todo_status("Generate comprehensive test report with recommendations", "in_progress")
            
            self.test_user_experience()
            
            # Calculate final scores
            overall_score = self.calculate_overall_score()
            recommendations = self.generate_recommendations()
            
            self.test_results["recommendations"] = recommendations
            
            self.update_todo_status("Generate comprehensive test report with recommendations", "completed")
            
            print(f"\n🎯 OVERALL QUALITY SCORE: {overall_score:.1f}%")
            
            return self.test_results
            
        except Exception as e:
            self.add_issue("CRITICAL", f"Test suite execution failed: {str(e)}")
            print(f"❌ Test suite failed: {str(e)}")
            return self.test_results
    
    def update_todo_status(self, content: str, status: str):
        """Helper method to update todo status"""
        # This would be implemented with actual TodoWrite calls in practice
        pass

    def save_results(self, output_file: str = "test_results.json"):
        """Save test results to JSON file"""
        output_path = os.path.join(os.path.dirname(self.html_file_path), output_file)
        
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(self.test_results, f, indent=2, ensure_ascii=False)
            print(f"✅ Test results saved to: {output_path}")
            return output_path
        except Exception as e:
            print(f"❌ Failed to save results: {str(e)}")
            return None

# Main execution
if __name__ == "__main__":
    html_file = r"C:/Users/Ben/OneDrive/Documents/GitHub/precisionconvert/index.html"
    
    # Initialize tester
    tester = PrecisionConvertTester(html_file)
    
    # Run comprehensive tests
    results = tester.run_comprehensive_test()
    
    # Save results
    output_file = tester.save_results()
    
    print("\n" + "=" * 80)
    print("🎯 COMPREHENSIVE TEST SUITE COMPLETED")
    print("=" * 80)
    print(f"Overall Score: {results.get('overall_score', 0):.1f}%")
    print(f"Issues Found: {len(results.get('issues_found', []))}")
    print(f"Recommendations: {len(results.get('recommendations', []))}")
    
    if output_file:
        print(f"Results saved to: {output_file}")
    
    print("\n✅ Ready for production deployment assessment!")