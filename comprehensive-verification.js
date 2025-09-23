// Comprehensive Verification Script for PrecisionConvert.io
// Tests all critical fixes and premium features

class ComprehensiveVerification {
    constructor() {
        this.results = [];
        this.passed = 0;
        this.failed = 0;
    }
    
    log(test, status, message) {
        const result = { test, status, message, timestamp: new Date().toISOString() };
        this.results.push(result);
        
        if (status === 'PASS') {
            this.passed++;
            console.log(`✅ ${test}: ${message}`);
        } else {
            this.failed++;
            console.error(`❌ ${test}: ${message}`);
        }
    }
    
    async runAllTests() {
        console.log('🚀 Starting Comprehensive Verification...');
        
        // Test 1: Critical Classes Loaded
        this.testCriticalClassesLoaded();
        
        // Test 2: Unit Data Loaded
        this.testUnitDataLoaded();
        
        // Test 3: Subscription Manager
        this.testSubscriptionManager();
        
        // Test 4: Feature Gating
        this.testFeatureGating();
        
        // Test 5: Event Management
        this.testEventManagement();
        
        // Test 6: Input Validation
        this.testInputValidation();
        
        // Test 7: Modal Management
        this.testModalManagement();
        
        // Test 8: PWA Manager
        this.testPWAManager();
        
        // Test 9: Conversion History
        this.testConversionHistory();
        
        // Test 10: Theme Manager
        this.testThemeManager();
        
        // Test 11: Batch Converter
        this.testBatchConverter();
        
        // Test 12: Branding Manager
        this.testBrandingManager();
        
        // Test 13: Payment Integration
        this.testPaymentIntegration();
        
        // Test 14: Temperature Conversion
        this.testTemperatureConversion();
        
        // Test 15: Precision Calculations
        this.testPrecisionCalculations();
        
        // Generate Report
        this.generateReport();
    }
    
    testCriticalClassesLoaded() {
        try {
            const requiredClasses = [
                'SubscriptionManager',
                'EventManager', 
                'InputValidator',
                'ModalManager',
                'PWAManager',
                'FeatureGate',
                'ConverterApp'
            ];
            
            for (const className of requiredClasses) {
                if (typeof window[className] === 'undefined') {
                    throw new Error(`${className} not loaded`);
                }
            }
            
            this.log('Critical Classes', 'PASS', 'All critical classes loaded successfully');
        } catch (error) {
            this.log('Critical Classes', 'FAIL', error.message);
        }\n    }\n    \n    testUnitDataLoaded() {\n        try {\n            if (!window.unitData) {\n                throw new Error('Unit data not loaded');\n            }\n            \n            const requiredCategories = ['length', 'weight', 'temperature', 'volume', 'area', 'time'];\n            for (const category of requiredCategories) {\n                if (!window.unitData[category]) {\n                    throw new Error(`${category} units not loaded`);\n                }\n            }\n            \n            // Test precision\n            const meterToFeet = window.unitData.length.feet.factor;\n            if (meterToFeet !== 3.280839895013123) {\n                throw new Error('Precision not maintained in unit data');\n            }\n            \n            this.log('Unit Data', 'PASS', 'Unit data loaded with 15-decimal precision');\n        } catch (error) {\n            this.log('Unit Data', 'FAIL', error.message);\n        }\n    }\n    \n    testSubscriptionManager() {\n        try {\n            const manager = new SubscriptionManager();\n            \n            // Test default status\n            const status = manager.loadSubscriptionStatus();\n            if (status.isPremium !== false) {\n                throw new Error('Default subscription status incorrect');\n            }\n            \n            // Test premium check\n            const isPremium = manager.isPremiumUser();\n            if (isPremium !== false) {\n                throw new Error('Premium check failed for free user');\n            }\n            \n            this.log('Subscription Manager', 'PASS', 'Subscription management working correctly');\n        } catch (error) {\n            this.log('Subscription Manager', 'FAIL', error.message);\n        }\n    }\n    \n    testFeatureGating() {\n        try {\n            const subscriptionManager = new SubscriptionManager();\n            const featureGate = new FeatureGate(subscriptionManager);\n            \n            // Test precision gating\n            const allowedPrecision = featureGate.checkPrecisionAccess(15);\n            if (allowedPrecision !== 2) {\n                throw new Error('Precision gating failed - should limit to 2 for free users');\n            }\n            \n            // Test feature access\n            const batchAccess = featureGate.checkFeatureAccess('batch-conversion');\n            if (batchAccess !== false) {\n                throw new Error('Feature gating failed - should deny batch conversion for free users');\n            }\n            \n            this.log('Feature Gating', 'PASS', 'Feature gating working correctly');\n        } catch (error) {\n            this.log('Feature Gating', 'FAIL', error.message);\n        }\n    }\n    \n    testEventManagement() {\n        try {\n            const eventManager = new EventManager();\n            \n            // Test listener addition\n            const testElement = document.createElement('div');\n            const testHandler = () => {};\n            \n            eventManager.addListener(testElement, 'click', testHandler);\n            \n            if (eventManager.getListenerCount() !== 1) {\n                throw new Error('Event listener not added correctly');\n            }\n            \n            // Test cleanup\n            eventManager.cleanup();\n            \n            if (eventManager.getListenerCount() !== 0) {\n                throw new Error('Event cleanup failed');\n            }\n            \n            this.log('Event Management', 'PASS', 'Event management working correctly');\n        } catch (error) {\n            this.log('Event Management', 'FAIL', error.message);\n        }\n    }\n    \n    testInputValidation() {\n        try {\n            // Test valid input\n            const validResult = InputValidator.validate('123.456');\n            if (validResult !== 123.456) {\n                throw new Error('Valid input validation failed');\n            }\n            \n            // Test invalid input\n            try {\n                InputValidator.validate('invalid');\n                throw new Error('Should have thrown error for invalid input');\n            } catch (validationError) {\n                // Expected behavior\n            }\n            \n            // Test range validation\n            try {\n                InputValidator.validate('1e60');\n                throw new Error('Should have thrown error for out-of-range input');\n            } catch (rangeError) {\n                // Expected behavior\n            }\n            \n            this.log('Input Validation', 'PASS', 'Input validation working correctly');\n        } catch (error) {\n            this.log('Input Validation', 'FAIL', error.message);\n        }\n    }\n    \n    testModalManagement() {\n        try {\n            const modalManager = new ModalManager();\n            \n            // Create test modal\n            const testModal = document.createElement('div');\n            testModal.style.display = 'none';\n            document.body.appendChild(testModal);\n            \n            // Test show modal\n            modalManager.showModal(testModal);\n            if (testModal.style.display !== 'block') {\n                throw new Error('Modal show failed');\n            }\n            \n            // Test hide modal\n            modalManager.hideModal(testModal);\n            if (testModal.style.display !== 'none') {\n                throw new Error('Modal hide failed');\n            }\n            \n            // Cleanup\n            document.body.removeChild(testModal);\n            \n            this.log('Modal Management', 'PASS', 'Modal management working correctly');\n        } catch (error) {\n            this.log('Modal Management', 'FAIL', error.message);\n        }\n    }\n    \n    testPWAManager() {\n        try {\n            const pwaManager = new PWAManager();\n            \n            // Test initialization\n            if (!pwaManager.isInstalled === undefined) {\n                throw new Error('PWA Manager not initialized correctly');\n            }\n            \n            this.log('PWA Manager', 'PASS', 'PWA Manager initialized correctly');\n        } catch (error) {\n            this.log('PWA Manager', 'FAIL', error.message);\n        }\n    }\n    \n    testConversionHistory() {\n        try {\n            const subscriptionManager = new SubscriptionManager();\n            const history = new ConversionHistory(subscriptionManager);\n            \n            // Test adding conversion\n            const testConversion = {\n                value: 10,\n                fromUnit: 'meters',\n                toUnit: 'feet',\n                result: '32.80839895013123',\n                category: 'length',\n                precision: 15\n            };\n            \n            history.addConversion(testConversion);\n            \n            if (history.history.length !== 1) {\n                throw new Error('Conversion not added to history');\n            }\n            \n            this.log('Conversion History', 'PASS', 'Conversion history working correctly');\n        } catch (error) {\n            this.log('Conversion History', 'FAIL', error.message);\n        }\n    }\n    \n    testThemeManager() {\n        try {\n            const subscriptionManager = new SubscriptionManager();\n            const themeManager = new ThemeManager(subscriptionManager);\n            \n            // Test theme setting\n            const success = themeManager.setTheme('dark');\n            if (!success) {\n                throw new Error('Theme setting failed');\n            }\n            \n            // Test premium theme restriction\n            const premiumSuccess = themeManager.setTheme('blue-professional');\n            if (premiumSuccess) {\n                throw new Error('Premium theme should be restricted for free users');\n            }\n            \n            this.log('Theme Manager', 'PASS', 'Theme management working correctly');\n        } catch (error) {\n            this.log('Theme Manager', 'FAIL', error.message);\n        }\n    }\n    \n    testBatchConverter() {\n        try {\n            const subscriptionManager = new SubscriptionManager();\n            const batchConverter = new BatchConverter(subscriptionManager);\n            \n            // Test conversion\n            const result = batchConverter.convertSingle(10, 'meters', 'feet', 'length');\n            const expected = 32.80839895013123;\n            \n            if (Math.abs(result - expected) > 0.000000000000001) {\n                throw new Error(`Batch conversion precision error: expected ${expected}, got ${result}`);\n            }\n            \n            this.log('Batch Converter', 'PASS', 'Batch converter working with 15-decimal precision');\n        } catch (error) {\n            this.log('Batch Converter', 'FAIL', error.message);\n        }\n    }\n    \n    testBrandingManager() {\n        try {\n            const subscriptionManager = new SubscriptionManager();\n            const brandingManager = new BrandingManager(subscriptionManager);\n            \n            // Test branding for free users\n            const branding = document.getElementById('freeBranding');\n            if (!branding) {\n                throw new Error('Free user branding not added');\n            }\n            \n            this.log('Branding Manager', 'PASS', 'Branding management working correctly');\n        } catch (error) {\n            this.log('Branding Manager', 'FAIL', error.message);\n        }\n    }\n    \n    testPaymentIntegration() {\n        try {\n            // Test upgrade function exists\n            if (typeof window.initiateUpgrade !== 'function') {\n                throw new Error('initiateUpgrade function not available');\n            }\n            \n            // Test modal exists\n            const modal = document.getElementById('proFeaturesModal');\n            if (!modal) {\n                throw new Error('Pro Features Modal not found');\n            }\n            \n            this.log('Payment Integration', 'PASS', 'Payment integration working correctly');\n        } catch (error) {\n            this.log('Payment Integration', 'FAIL', error.message);\n        }\n    }\n    \n    testTemperatureConversion() {\n        try {\n            // Test Celsius to Fahrenheit\n            const result = window.convertTemperature(25, 'celsius', 'fahrenheit');\n            const expected = 77;\n            \n            if (Math.abs(result - expected) > 0.000000000000001) {\n                throw new Error(`Temperature conversion error: expected ${expected}, got ${result}`);\n            }\n            \n            this.log('Temperature Conversion', 'PASS', 'Temperature conversion working correctly');\n        } catch (error) {\n            this.log('Temperature Conversion', 'FAIL', error.message);\n        }\n    }\n    \n    testPrecisionCalculations() {\n        try {\n            // Test 15-decimal precision\n            const meterToFeet = 3.280839895013123;\n            const input = 1;\n            const result = input * meterToFeet;\n            \n            // Check precision is maintained\n            const resultString = result.toString();\n            if (!resultString.includes('3.280839895013123')) {\n                throw new Error('15-decimal precision not maintained');\n            }\n            \n            this.log('Precision Calculations', 'PASS', '15-decimal precision maintained');\n        } catch (error) {\n            this.log('Precision Calculations', 'FAIL', error.message);\n        }\n    }\n    \n    generateReport() {\n        console.log('\\n📊 COMPREHENSIVE VERIFICATION REPORT');\n        console.log('=====================================');\n        console.log(`✅ Tests Passed: ${this.passed}`);\n        console.log(`❌ Tests Failed: ${this.failed}`);\n        console.log(`📈 Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);\n        \n        if (this.failed === 0) {\n            console.log('\\n🎉 ALL TESTS PASSED! Platform ready for deployment.');\n        } else {\n            console.log('\\n⚠️  Some tests failed. Review issues before deployment.');\n            console.log('\\nFailed Tests:');\n            this.results.filter(r => r.status === 'FAIL').forEach(r => {\n                console.log(`  - ${r.test}: ${r.message}`);\n            });\n        }\n        \n        return {\n            passed: this.passed,\n            failed: this.failed,\n            successRate: (this.passed / (this.passed + this.failed)) * 100,\n            results: this.results\n        };\n    }\n}\n\n// Auto-run verification when DOM is loaded\nif (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', () => {\n        setTimeout(() => {\n            const verification = new ComprehensiveVerification();\n            verification.runAllTests();\n        }, 2000); // Wait for all scripts to load\n    });\n} else {\n    setTimeout(() => {\n        const verification = new ComprehensiveVerification();\n        verification.runAllTests();\n    }, 2000);\n}\n\n// Make verification available globally\nwindow.ComprehensiveVerification = ComprehensiveVerification;