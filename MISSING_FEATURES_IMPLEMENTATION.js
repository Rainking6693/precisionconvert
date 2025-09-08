// MISSING FEATURES IMPLEMENTATION
// PrecisionConvert.io - Critical Premium Features
// Implementation Date: [Current Date]

/**
 * CONVERSION HISTORY SYSTEM
 * Implements tier-differentiated conversion history
 */
class ConversionHistory {
    constructor(subscriptionManager) {
        this.subscriptionManager = subscriptionManager;
        this.history = this.loadHistory();
        this.maxFreeEntries = 5;
    }
    
    addConversion(conversion) {
        const isPremium = this.subscriptionManager.isPremiumUser();
        
        const historyEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            value: conversion.value,
            fromUnit: conversion.fromUnit,
            toUnit: conversion.toUnit,
            result: conversion.result,
            category: conversion.category,
            precision: conversion.precision
        };
        
        this.history.unshift(historyEntry);
        
        // Limit free users to 5 entries
        if (!isPremium && this.history.length > this.maxFreeEntries) {
            this.history = this.history.slice(0, this.maxFreeEntries);
        }
        
        this.saveHistory();
        this.updateHistoryDisplay();
    }
    
    loadHistory() {
        const stored = localStorage.getItem('conversion_history');
        return stored ? JSON.parse(stored) : [];
    }
    
    saveHistory() {
        localStorage.setItem('conversion_history', JSON.stringify(this.history));
    }
    
    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        const historyContainer = document.getElementById('historyContainer');
        if (!historyContainer) return;
        
        const isPremium = this.subscriptionManager.isPremiumUser();
        
        historyContainer.innerHTML = '';
        
        if (this.history.length === 0) {
            historyContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 1rem;">No conversion history yet</p>';
            return;
        }
        
        this.history.forEach((entry, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem;
                border-bottom: 1px solid var(--border-color);
                background: var(--surface-color);
                margin-bottom: 0.5rem;
                border-radius: 0.5rem;
            `;
            
            historyItem.innerHTML = `
                <div>
                    <div style="font-weight: 600; color: var(--text-primary);">
                        ${entry.value} ${entry.fromUnit} → ${entry.result} ${entry.toUnit}
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">
                        ${new Date(entry.timestamp).toLocaleString()} • ${entry.category}
                    </div>
                </div>
                <button onclick="conversionHistory.replayConversion(${index})" 
                        style="background: var(--primary-color); color: white; border: none; padding: 0.5rem; border-radius: 0.25rem; cursor: pointer;">
                    ↻ Replay
                </button>
            `;
            
            historyContainer.appendChild(historyItem);
        });
        
        // Show upgrade prompt for free users at limit
        if (!isPremium && this.history.length >= this.maxFreeEntries) {
            const upgradePrompt = document.createElement('div');
            upgradePrompt.style.cssText = `
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                padding: 1rem;
                border-radius: 0.5rem;
                text-align: center;
                margin-top: 1rem;
            `;
            upgradePrompt.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 0.5rem;">History Limit Reached</div>
                <div style="font-size: 0.9rem; margin-bottom: 1rem;">Upgrade to Pro for unlimited conversion history</div>
                <button onclick="initiateUpgrade()" style="background: white; color: var(--primary-color); border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; font-weight: 600; cursor: pointer;">
                    Upgrade for $4.99/month
                </button>
            `;
            historyContainer.appendChild(upgradePrompt);
        }
    }
    
    replayConversion(index) {
        const entry = this.history[index];
        if (!entry) return;
        
        // Set the converter to replay this conversion
        switchCategory(entry.category);
        elements.fromUnit.value = entry.fromUnit;
        elements.toUnit.value = entry.toUnit;
        elements.inputValue.value = entry.value;
        elements.precision.value = entry.precision;
        convert();
    }
    
    exportHistory() {
        const isPremium = this.subscriptionManager.isPremiumUser();
        if (!isPremium) {
            featureGate.showUpgradePrompt('feature', 'export history');
            return;
        }
        
        const csv = this.generateCSV();
        this.downloadCSV(csv, 'conversion-history.csv');
    }
    
    generateCSV() {
        const headers = ['Timestamp', 'Category', 'Input Value', 'From Unit', 'To Unit', 'Result', 'Precision'];
        const rows = this.history.map(entry => [
            entry.timestamp,
            entry.category,
            entry.value,
            entry.fromUnit,
            entry.toUnit,
            entry.result,
            entry.precision
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

/**
 * THEME MANAGEMENT SYSTEM
 * Implements premium theme system with proper gating
 */
class ThemeManager {
    constructor(subscriptionManager) {
        this.subscriptionManager = subscriptionManager;
        this.currentTheme = this.loadTheme();
        this.initializeThemes();
        this.applyTheme(this.currentTheme);
    }
    
    initializeThemes() {
        // Add premium theme CSS to document
        const premiumThemeCSS = `
            [data-theme="blue-professional"] {
                --primary-color: #1e40af;
                --secondary-color: #1e3a8a;
                --accent-color: #3b82f6;
                --background-color: #f8fafc;
                --surface-color: #e0f2fe;
                --text-primary: #1e293b;
                --text-secondary: #475569;
                --border-color: #cbd5e1;
                --shadow: 0 1px 3px 0 rgba(30, 64, 175, 0.1), 0 1px 2px 0 rgba(30, 64, 175, 0.06);
                --shadow-lg: 0 10px 15px -3px rgba(30, 64, 175, 0.1), 0 4px 6px -2px rgba(30, 64, 175, 0.05);
            }
            
            [data-theme="green-professional"] {
                --primary-color: #059669;
                --secondary-color: #047857;
                --accent-color: #10b981;
                --background-color: #f0fdf4;
                --surface-color: #dcfce7;
                --text-primary: #1e293b;
                --text-secondary: #475569;
                --border-color: #bbf7d0;
                --shadow: 0 1px 3px 0 rgba(5, 150, 105, 0.1), 0 1px 2px 0 rgba(5, 150, 105, 0.06);
                --shadow-lg: 0 10px 15px -3px rgba(5, 150, 105, 0.1), 0 4px 6px -2px rgba(5, 150, 105, 0.05);
            }
            
            [data-theme="purple-professional"] {
                --primary-color: #7c3aed;
                --secondary-color: #6d28d9;
                --accent-color: #8b5cf6;
                --background-color: #faf5ff;
                --surface-color: #f3e8ff;
                --text-primary: #1e293b;
                --text-secondary: #475569;
                --border-color: #e9d5ff;
                --shadow: 0 1px 3px 0 rgba(124, 58, 237, 0.1), 0 1px 2px 0 rgba(124, 58, 237, 0.06);
                --shadow-lg: 0 10px 15px -3px rgba(124, 58, 237, 0.1), 0 4px 6px -2px rgba(124, 58, 237, 0.05);
            }
            
            [data-theme="orange-professional"] {
                --primary-color: #ea580c;
                --secondary-color: #c2410c;
                --accent-color: #f97316;
                --background-color: #fffbeb;
                --surface-color: #fed7aa;
                --text-primary: #1e293b;
                --text-secondary: #475569;
                --border-color: #fdba74;
                --shadow: 0 1px 3px 0 rgba(234, 88, 12, 0.1), 0 1px 2px 0 rgba(234, 88, 12, 0.06);
                --shadow-lg: 0 10px 15px -3px rgba(234, 88, 12, 0.1), 0 4px 6px -2px rgba(234, 88, 12, 0.05);
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = premiumThemeCSS;
        document.head.appendChild(style);
    }
    
    getAvailableThemes() {
        const isPremium = this.subscriptionManager.isPremiumUser();
        
        const freeThemes = [
            { id: 'light', name: 'Light Professional', premium: false, icon: '☀️' },
            { id: 'dark', name: 'Dark Professional', premium: false, icon: '🌙' },
            { id: 'high-contrast', name: 'High Contrast', premium: false, icon: '🔲' }
        ];
        
        const premiumThemes = [
            { id: 'blue-professional', name: 'Blue Professional', premium: true, icon: '🔵' },
            { id: 'green-professional', name: 'Green Professional', premium: true, icon: '🟢' },
            { id: 'purple-professional', name: 'Purple Professional', premium: true, icon: '🟣' },
            { id: 'orange-professional', name: 'Orange Professional', premium: true, icon: '🟠' }
        ];
        
        return isPremium ? [...freeThemes, ...premiumThemes] : freeThemes;
    }
    
    setTheme(themeId) {
        const availableThemes = this.getAvailableThemes();
        const theme = availableThemes.find(t => t.id === themeId);
        
        if (!theme) {
            if (this.isPremiumTheme(themeId)) {
                featureGate.showUpgradePrompt('feature', 'premium themes');
                return false;
            }
            return false;
        }
        
        this.currentTheme = themeId;
        this.applyTheme(themeId);
        this.saveTheme(themeId);
        this.updateThemeSelector();
        return true;
    }
    
    isPremiumTheme(themeId) {
        const premiumThemes = ['blue-professional', 'green-professional', 'purple-professional', 'orange-professional'];
        return premiumThemes.includes(themeId);
    }
    
    applyTheme(themeId) {
        document.documentElement.setAttribute('data-theme', themeId);
    }
    
    loadTheme() {
        return localStorage.getItem('selected_theme') || 'light';
    }
    
    saveTheme(themeId) {
        localStorage.setItem('selected_theme', themeId);
    }
    
    createThemeSelector() {
        const themeSelector = document.createElement('div');
        themeSelector.id = 'themeSelector';
        themeSelector.style.cssText = `
            position: relative;
            display: inline-block;
        `;
        
        const themeButton = document.createElement('button');
        themeButton.id = 'themeButton';
        themeButton.style.cssText = `
            background: var(--surface-color);
            color: var(--text-primary);
            border: 2px solid var(--border-color);
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        themeButton.innerHTML = '🎨 Themes';
        themeButton.onclick = () => this.toggleThemeDropdown();
        
        const themeDropdown = document.createElement('div');
        themeDropdown.id = 'themeDropdown';
        themeDropdown.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: var(--background-color);
            border: 2px solid var(--border-color);
            border-radius: 0.5rem;
            box-shadow: var(--shadow-lg);
            min-width: 200px;
            z-index: 1000;
            display: none;
        `;
        
        themeSelector.appendChild(themeButton);
        themeSelector.appendChild(themeDropdown);
        
        this.updateThemeSelector();
        
        return themeSelector;
    }
    
    updateThemeSelector() {
        const dropdown = document.getElementById('themeDropdown');
        if (!dropdown) return;
        
        const themes = this.getAvailableThemes();
        const isPremium = this.subscriptionManager.isPremiumUser();
        
        dropdown.innerHTML = '';
        
        themes.forEach(theme => {
            const themeOption = document.createElement('div');
            themeOption.style.cssText = `
                padding: 0.75rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid var(--border-color);
                transition: background-color 0.2s;
            `;
            
            themeOption.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span>${theme.icon}</span>
                    <span>${theme.name}</span>
                    ${theme.premium ? '<span style="background: var(--primary-color); color: white; padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem;">PRO</span>' : ''}
                </div>
                ${this.currentTheme === theme.id ? '<span>✓</span>' : ''}
            `;
            
            themeOption.onmouseover = () => {
                themeOption.style.backgroundColor = 'var(--surface-color)';
            };
            themeOption.onmouseout = () => {
                themeOption.style.backgroundColor = 'transparent';
            };
            
            themeOption.onclick = () => {
                if (theme.premium && !isPremium) {
                    featureGate.showUpgradePrompt('feature', 'premium themes');
                } else {
                    this.setTheme(theme.id);
                    this.toggleThemeDropdown();
                }
            };
            
            dropdown.appendChild(themeOption);
        });
        
        // Add upgrade prompt for free users
        if (!isPremium) {
            const upgradeOption = document.createElement('div');
            upgradeOption.style.cssText = `
                padding: 0.75rem;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                text-align: center;
                cursor: pointer;
                font-weight: 600;
            `;
            upgradeOption.innerHTML = 'Unlock 4 Premium Themes - $4.99/month';
            upgradeOption.onclick = () => {
                initiateUpgrade();
                this.toggleThemeDropdown();
            };
            dropdown.appendChild(upgradeOption);
        }
    }
    
    toggleThemeDropdown() {
        const dropdown = document.getElementById('themeDropdown');
        if (!dropdown) return;
        
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

/**
 * BATCH CONVERSION SYSTEM
 * Implements premium batch conversion functionality
 */
class BatchConverter {
    constructor(subscriptionManager) {
        this.subscriptionManager = subscriptionManager;
    }
    
    showBatchModal() {
        const isPremium = this.subscriptionManager.isPremiumUser();
        if (!isPremium) {
            featureGate.showUpgradePrompt('feature', 'batch conversion');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'batch-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        modal.innerHTML = `
            <div style="background: var(--background-color); padding: 2rem; border-radius: 1rem; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="color: var(--primary-color); margin: 0;">Batch Conversion</h2>
                    <button onclick="this.closest('.batch-modal').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary);">&times;</button>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Input Values (one per line):</label>
                    <textarea id="batchInput" placeholder="1&#10;2.5&#10;3.14159&#10;100" style="width: 100%; height: 150px; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 0.5rem; font-family: monospace;"></textarea>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">From Unit:</label>
                        <select id="batchFromUnit" style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 0.5rem;">
                            <!-- Units will be populated based on current category -->
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">To Unit:</label>
                        <select id="batchToUnit" style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 0.5rem;">
                            <!-- Units will be populated based on current category -->
                        </select>
                    </div>
                </div>
                
                <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
                    <button onclick="batchConverter.processBatch()" style="background: var(--primary-color); color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; flex: 1;">
                        Convert All
                    </button>
                    <button onclick="batchConverter.exportResults()" style="background: var(--surface-color); color: var(--text-primary); border: 2px solid var(--border-color); padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">
                        Export CSV
                    </button>
                </div>
                
                <div id="batchResults" style="max-height: 300px; overflow-y: auto;"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.populateBatchUnits();
    }
    
    populateBatchUnits() {
        const fromSelect = document.getElementById('batchFromUnit');
        const toSelect = document.getElementById('batchToUnit');
        const units = unitData[currentCategory];
        
        if (!fromSelect || !toSelect || !units) return;
        
        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';
        
        Object.keys(units).forEach(key => {
            const option1 = new Option(units[key].name, key);
            const option2 = new Option(units[key].name, key);
            fromSelect.appendChild(option1);
            toSelect.appendChild(option2);
        });
        
        // Set defaults
        const unitKeys = Object.keys(units);
        if (unitKeys.length > 1) {
            fromSelect.value = unitKeys[0];
            toSelect.value = unitKeys[1];
        }
    }
    
    processBatch() {
        const input = document.getElementById('batchInput').value;
        const fromUnit = document.getElementById('batchFromUnit').value;
        const toUnit = document.getElementById('batchToUnit').value;
        const resultsContainer = document.getElementById('batchResults');
        
        if (!input.trim()) {
            alert('Please enter values to convert');
            return;
        }
        
        const values = input.split('\n').filter(line => line.trim());
        const results = [];
        
        values.forEach((value, index) => {
            try {
                const numValue = InputValidator.validate(value.trim());
                const result = this.convertSingle(numValue, fromUnit, toUnit, currentCategory);
                results.push({
                    input: value.trim(),
                    output: result,
                    status: 'success'
                });
            } catch (error) {
                results.push({
                    input: value.trim(),
                    output: null,
                    status: 'error',
                    error: error.message
                });
            }
        });
        
        this.displayResults(results);
        this.lastResults = results;
    }
    
    convertSingle(value, fromUnit, toUnit, category) {
        if (category === 'temperature') {
            return convertTemperature(value, fromUnit, toUnit);
        } else {
            const units = unitData[category];
            if (units && units[fromUnit] && units[toUnit]) {
                const fromFactor = units[fromUnit].factor;
                const toFactor = units[toUnit].factor;
                return (value / fromFactor) * toFactor;
            }
        }
        throw new Error('Invalid unit conversion');
    }
    
    displayResults(results) {
        const container = document.getElementById('batchResults');
        if (!container) return;
        
        container.innerHTML = '<h3 style="color: var(--primary-color); margin-bottom: 1rem;">Results:</h3>';
        
        results.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem;
                border-bottom: 1px solid var(--border-color);
                background: ${result.status === 'success' ? 'var(--surface-color)' : '#fee2e2'};
                margin-bottom: 0.25rem;
                border-radius: 0.25rem;
            `;
            
            if (result.status === 'success') {
                resultItem.innerHTML = `
                    <span>${result.input}</span>
                    <span style="font-weight: 600; color: var(--primary-color);">${result.output}</span>
                `;
            } else {
                resultItem.innerHTML = `
                    <span>${result.input}</span>
                    <span style="color: #dc2626; font-size: 0.9rem;">Error: ${result.error}</span>
                `;
            }
            
            container.appendChild(resultItem);
        });
    }
    
    exportResults() {
        if (!this.lastResults) {
            alert('No results to export. Please run a batch conversion first.');
            return;
        }
        
        const csv = this.generateCSV(this.lastResults);
        this.downloadCSV(csv, 'batch-conversion-results.csv');
    }
    
    generateCSV(results) {
        const headers = ['Input', 'Output', 'Status', 'Error'];
        const rows = results.map(result => [
            result.input,
            result.output || '',
            result.status,
            result.error || ''
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

/**
 * BRANDING SYSTEM
 * Implements "Powered by" branding for free users
 */
class BrandingManager {
    constructor(subscriptionManager) {
        this.subscriptionManager = subscriptionManager;
        this.updateBranding();
    }
    
    updateBranding() {
        const isPremium = this.subscriptionManager.isPremiumUser();
        
        // Remove existing branding
        const existingBranding = document.getElementById('freeBranding');
        if (existingBranding) {
            existingBranding.remove();
        }
        
        // Add branding for free users
        if (!isPremium) {
            this.addFreeBranding();
        }
    }
    
    addFreeBranding() {
        const branding = document.createElement('div');
        branding.id = 'freeBranding';
        branding.style.cssText = `
            position: fixed;
            bottom: 1rem;
            right: 1rem;
            background: var(--surface-color);
            border: 2px solid var(--border-color);
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.8rem;
            color: var(--text-secondary);
            z-index: 100;
            box-shadow: var(--shadow);
        `;
        
        branding.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>Powered by</span>
                <a href="https://precisionconvert.io" style="color: var(--primary-color); text-decoration: none; font-weight: 600;">PrecisionConvert.io</a>
                <button onclick="initiateUpgrade()" style="background: var(--primary-color); color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; cursor: pointer; margin-left: 0.5rem;">
                    Remove
                </button>
            </div>
        `;
        
        document.body.appendChild(branding);
    }
}

// Export classes for use in main application
if (typeof window !== 'undefined') {
    window.ConversionHistory = ConversionHistory;
    window.ThemeManager = ThemeManager;
    window.BatchConverter = BatchConverter;
    window.BrandingManager = BrandingManager;
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize missing features after main app is loaded
    setTimeout(() => {
        if (typeof subscriptionManager !== 'undefined') {
            window.conversionHistory = new ConversionHistory(subscriptionManager);
            window.themeManager = new ThemeManager(subscriptionManager);
            window.batchConverter = new BatchConverter(subscriptionManager);
            window.brandingManager = new BrandingManager(subscriptionManager);
            
            // Add theme selector to navigation
            const navControls = document.querySelector('.nav-controls');
            if (navControls && !document.getElementById('themeSelector')) {
                const themeSelector = themeManager.createThemeSelector();
                navControls.insertBefore(themeSelector, navControls.firstChild);
            }
            
            console.log('✅ Missing premium features initialized successfully');
        }
    }, 1000);
});