// CRITICAL MATHEMATICAL ACCURACY FIXES
// PrecisionConvert.io - Professional-Grade Conversion Factors
// Updated: [Current Date] - Riley Testing Phase 1

/**
 * CORRECTED UNIT CONVERSION DATA
 * All factors updated to 15-decimal precision for professional-grade accuracy
 * Based on international standards and verified mathematical constants
 */

const correctedUnitData = {
    length: {
        meters: { name: 'Meters', factor: 1 },
        feet: { name: 'Feet', factor: 3.280839895013123 },           // CORRECTED: Was 3.28084
        inches: { name: 'Inches', factor: 39.37007874015748 },       // CORRECTED: Was 39.3701
        kilometers: { name: 'Kilometers', factor: 0.001 },
        miles: { name: 'Miles', factor: 0.000621371192237334 },      // CORRECTED: Was 0.000621371
        yards: { name: 'Yards', factor: 1.093613298337708 },         // CORRECTED: Was 1.09361
        centimeters: { name: 'Centimeters', factor: 100 },
        millimeters: { name: 'Millimeters', factor: 1000 },
        // Additional professional units
        nautical_miles: { name: 'Nautical Miles', factor: 0.000539956803455724 },
        light_years: { name: 'Light Years', factor: 1.057000834024615e-16 },
        angstroms: { name: 'Angstroms', factor: 10000000000 }
    },
    
    weight: {
        kilograms: { name: 'Kilograms', factor: 1 },
        pounds: { name: 'Pounds', factor: 2.204622621848776 },        // CORRECTED: Was 2.20462
        ounces: { name: 'Ounces', factor: 35.27396194958041 },        // CORRECTED: Was 35.274
        grams: { name: 'Grams', factor: 1000 },
        tons: { name: 'Tons (metric)', factor: 0.001 },
        stones: { name: 'Stones', factor: 0.157473044418605 },        // CORRECTED: Was 0.157473
        // Additional professional units
        troy_ounces: { name: 'Troy Ounces', factor: 32.15074656862795 },
        carats: { name: 'Carats', factor: 5000 },
        grains: { name: 'Grains', factor: 15432.358352941 }
    },
    
    temperature: {
        celsius: { name: 'Celsius' },
        fahrenheit: { name: 'Fahrenheit' },
        kelvin: { name: 'Kelvin' },
        // Additional professional units
        rankine: { name: 'Rankine' },
        reaumur: { name: 'Réaumur' }
    },
    
    volume: {
        liters: { name: 'Liters', factor: 1 },
        gallons: { name: 'Gallons (US)', factor: 0.264172052358148 },     // CORRECTED: Was 0.264172
        cups: { name: 'Cups (US)', factor: 4.226752837529 },              // CORRECTED: Was 4.22675
        milliliters: { name: 'Milliliters', factor: 1000 },
        tablespoons: { name: 'Tablespoons (US)', factor: 67.628045403686 }, // CORRECTED: Was 67.628
        teaspoons: { name: 'Teaspoons (US)', factor: 202.884136211058 },   // CORRECTED: Was 202.884
        // Additional professional units
        gallons_uk: { name: 'Gallons (UK)', factor: 0.219969248299088 },
        fluid_ounces_us: { name: 'Fluid Ounces (US)', factor: 33.814022558919 },
        fluid_ounces_uk: { name: 'Fluid Ounces (UK)', factor: 35.195079727854 },
        pints_us: { name: 'Pints (US)', factor: 2.113376418865 },
        quarts_us: { name: 'Quarts (US)', factor: 1.056688209432 },
        cubic_meters: { name: 'Cubic Meters', factor: 0.001 },
        cubic_feet: { name: 'Cubic Feet', factor: 0.035314666721489 },
        cubic_inches: { name: 'Cubic Inches', factor: 61.023744094732 }
    },
    
    area: {
        square_meters: { name: 'Square Meters', factor: 1 },
        square_feet: { name: 'Square Feet', factor: 10.763910416709722 },    // CORRECTED: Was 10.7639
        square_inches: { name: 'Square Inches', factor: 1550.003100006200 },  // CORRECTED: Was 1550
        acres: { name: 'Acres', factor: 0.000247105381467 },                  // CORRECTED: Was 0.000247105
        hectares: { name: 'Hectares', factor: 0.0001 },
        // Additional professional units
        square_kilometers: { name: 'Square Kilometers', factor: 0.000001 },
        square_miles: { name: 'Square Miles', factor: 3.861021585424458e-7 },
        square_yards: { name: 'Square Yards', factor: 1.195990046301 },
        square_centimeters: { name: 'Square Centimeters', factor: 10000 },
        square_millimeters: { name: 'Square Millimeters', factor: 1000000 }
    },
    
    time: {
        seconds: { name: 'Seconds', factor: 1 },
        minutes: { name: 'Minutes', factor: 0.016666666666667 },              // 1/60
        hours: { name: 'Hours', factor: 0.000277777777777778 },               // 1/3600
        days: { name: 'Days', factor: 0.000011574074074074 },                 // 1/86400
        weeks: { name: 'Weeks', factor: 0.000001653439153439 },               // 1/604800
        months: { name: 'Months (30 days)', factor: 3.858024691358e-7 },      // 1/2592000
        years: { name: 'Years (365 days)', factor: 3.168808781402e-8 },       // 1/31536000
        // Additional professional units
        milliseconds: { name: 'Milliseconds', factor: 1000 },
        microseconds: { name: 'Microseconds', factor: 1000000 },
        nanoseconds: { name: 'Nanoseconds', factor: 1000000000 }
    },
    
    // PREMIUM CATEGORIES (Professional Units)
    energy: {
        joules: { name: 'Joules', factor: 1 },
        calories: { name: 'Calories', factor: 0.239005736137667 },
        kilocalories: { name: 'Kilocalories', factor: 0.000239005736137667 },
        btu: { name: 'BTU', factor: 0.000947817120313317 },
        kilowatt_hours: { name: 'Kilowatt Hours', factor: 2.777777777777778e-7 },
        foot_pounds: { name: 'Foot-Pounds', factor: 0.737562149277265 }
    },
    
    pressure: {
        pascals: { name: 'Pascals', factor: 1 },
        atmospheres: { name: 'Atmospheres', factor: 0.000009869232667160 },
        bar: { name: 'Bar', factor: 0.00001 },
        psi: { name: 'PSI', factor: 0.000145037737730209 },
        torr: { name: 'Torr', factor: 0.007500616827041698 },
        mmhg: { name: 'mmHg', factor: 0.007500616827041698 }
    },
    
    speed: {
        meters_per_second: { name: 'Meters/Second', factor: 1 },
        kilometers_per_hour: { name: 'Kilometers/Hour', factor: 3.6 },
        miles_per_hour: { name: 'Miles/Hour', factor: 2.236936292054402 },
        feet_per_second: { name: 'Feet/Second', factor: 3.280839895013123 },
        knots: { name: 'Knots', factor: 1.943844492440605 }
    }
};

/**
 * CORRECTED TEMPERATURE CONVERSION FUNCTION
 * Enhanced with additional temperature scales and 15-decimal precision
 */
function convertTemperatureProfessional(value, from, to) {
    let celsius;
    
    // Convert to Celsius first (base unit)
    switch (from) {
        case 'celsius':
            celsius = value;
            break;
        case 'fahrenheit':
            celsius = (value - 32) * 5/9;
            break;
        case 'kelvin':
            celsius = value - 273.15;
            break;
        case 'rankine':
            celsius = (value - 491.67) * 5/9;
            break;
        case 'reaumur':
            celsius = value * 5/4;
            break;
        default:
            celsius = value;
    }
    
    // Convert from Celsius to target unit
    switch (to) {
        case 'celsius':
            return celsius;
        case 'fahrenheit':
            return celsius * 9/5 + 32;
        case 'kelvin':
            return celsius + 273.15;
        case 'rankine':
            return (celsius + 273.15) * 9/5;
        case 'reaumur':
            return celsius * 4/5;
        default:
            return celsius;
    }
}

/**
 * CORRECTED PRECISION CONTROL FUNCTION
 * Implements proper premium tier precision handling
 */
function formatResultWithPrecision(result, precision, useScientific, isPremium) {
    // Validate precision limits based on subscription
    let maxPrecision = isPremium ? 15 : 2;
    let actualPrecision = Math.min(precision, maxPrecision);
    
    // Handle very large or very small numbers with scientific notation
    if (useScientific && (Math.abs(result) >= 1e6 || Math.abs(result) <= 1e-6)) {
        return result.toExponential(actualPrecision);
    }
    
    // Standard decimal formatting
    return result.toFixed(actualPrecision);
}

/**
 * CORRECTED CONVERSION FUNCTION
 * Professional-grade implementation with proper error handling
 */
function convertProfessional(value, fromUnit, toUnit, category, precision, useScientific, isPremium) {
    try {
        // Input validation
        if (isNaN(value) || !isFinite(value)) {
            throw new Error('Invalid input value');
        }
        
        if (!fromUnit || !toUnit) {
            throw new Error('Missing unit selection');
        }
        
        let result = 0;
        
        // Special handling for temperature conversions
        if (category === 'temperature') {
            result = convertTemperatureProfessional(value, fromUnit, toUnit);
        } else {
            // Standard factor-based conversions
            const units = correctedUnitData[category];
            if (!units || !units[fromUnit] || !units[toUnit]) {
                throw new Error(`Unsupported unit conversion: ${fromUnit} to ${toUnit}`);
            }
            
            const fromFactor = units[fromUnit].factor;
            const toFactor = units[toUnit].factor;
            
            // High-precision calculation
            result = (value / fromFactor) * toFactor;
        }
        
        // Format result with appropriate precision
        return formatResultWithPrecision(result, precision, useScientific, isPremium);
        
    } catch (error) {
        console.error('Conversion error:', error);
        return 'Error: ' + error.message;
    }
}

/**
 * VALIDATION TESTS
 * Professional-grade test cases for mathematical accuracy
 */
const validationTests = [
    // Length conversions
    { value: 1, from: 'meters', to: 'feet', expected: '3.280839895013123', category: 'length' },
    { value: 1, from: 'feet', to: 'meters', expected: '0.3048', category: 'length' },
    { value: 1, from: 'inches', to: 'centimeters', expected: '2.54', category: 'length' },
    { value: 1, from: 'miles', to: 'kilometers', expected: '1.609344', category: 'length' },
    
    // Weight conversions
    { value: 1, from: 'kilograms', to: 'pounds', expected: '2.204622621848776', category: 'weight' },
    { value: 1, from: 'pounds', to: 'kilograms', expected: '0.45359237', category: 'weight' },
    
    // Temperature conversions
    { value: 0, from: 'celsius', to: 'fahrenheit', expected: '32', category: 'temperature' },
    { value: 32, from: 'fahrenheit', to: 'celsius', expected: '0', category: 'temperature' },
    { value: 0, from: 'celsius', to: 'kelvin', expected: '273.15', category: 'temperature' },
    
    // Volume conversions
    { value: 1, from: 'liters', to: 'gallons', expected: '0.264172052358148', category: 'volume' },
    { value: 1, from: 'gallons', to: 'liters', expected: '3.785411784', category: 'volume' },
    
    // Area conversions
    { value: 1, from: 'square_meters', to: 'square_feet', expected: '10.763910416709722', category: 'area' }
];

/**
 * RUN VALIDATION TESTS
 * Execute all test cases to verify mathematical accuracy
 */
function runValidationTests() {
    console.log('🧪 Running Professional-Grade Validation Tests...');
    
    let passedTests = 0;
    let totalTests = validationTests.length;
    
    validationTests.forEach((test, index) => {
        const result = convertProfessional(
            test.value, 
            test.from, 
            test.to, 
            test.category, 
            15, 
            false, 
            true // Premium user for testing
        );
        
        const passed = Math.abs(parseFloat(result) - parseFloat(test.expected)) < 1e-14;
        
        console.log(`Test ${index + 1}: ${test.value} ${test.from} → ${test.to}`);
        console.log(`Expected: ${test.expected}, Got: ${result}, ${passed ? '✅ PASS' : '❌ FAIL'}`);
        
        if (passed) passedTests++;
    });
    
    const accuracy = (passedTests / totalTests) * 100;
    console.log(`\n📊 Validation Results: ${passedTests}/${totalTests} tests passed (${accuracy.toFixed(1)}% accuracy)`);
    
    if (accuracy >= 95) {
        console.log('✅ PROFESSIONAL-GRADE ACCURACY ACHIEVED');
    } else {
        console.log('❌ ACCURACY BELOW PROFESSIONAL STANDARDS');
    }
    
    return { passedTests, totalTests, accuracy };
}

// Export for implementation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        correctedUnitData,
        convertTemperatureProfessional,
        convertProfessional,
        formatResultWithPrecision,
        runValidationTests,
        validationTests
    };
}

// Auto-run validation tests if in browser environment
if (typeof window !== 'undefined') {
    console.log('🔧 PrecisionConvert.io - Professional Mathematical Accuracy Fixes Loaded');
    console.log('📏 Ready to implement 15-decimal precision conversions');
}