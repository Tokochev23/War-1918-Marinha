// =================================================================================
// CONSTRUTOR NAVAL AVANÇADO - LÓGICA PRINCIPAL (BALANCEAMENTO V2)
// =================================================================================

const APP = {
    data: {
        hulls: {
            "submarine": { "name": "Submarino", "base_cost": 35550, "base_tonnage": 600, "base_speed": 15, "displacement_mod": 0.5, "slots": { "main_armament": 1, "secondary_armament": 2, "torpedo": 4, "utility": 4, "engine": 1 } },
            "destroyer": { "name": "Contratorpedeiro", "base_cost": 59250, "base_tonnage": 1500, "base_speed": 35, "displacement_mod": 1.0, "slots": { "main_armament": 2, "secondary_armament": 4, "torpedo": 2, "asw": 2, "utility": 6, "engine": 2 } },
            "light_cruiser": { "name": "Cruzador Leve", "base_cost": 118500, "base_tonnage": 4000, "base_speed": 32, "displacement_mod": 1.2, "slots": { "main_armament": 3, "secondary_armament": 6, "torpedo": 2, "asw": 1, "utility": 8, "engine": 3 } },
            "heavy_cruiser": { "name": "Cruzador Pesado", "base_cost": 237000, "base_tonnage": 10000, "base_speed": 30, "displacement_mod": 1.5, "slots": { "main_armament": 4, "secondary_armament": 8, "torpedo": 2, "utility": 10, "engine": 4 } },
            "battle_cruiser": { "name": "Cruzador de Batalha", "base_cost": 355500, "base_tonnage": 25000, "base_speed": 30, "displacement_mod": 2.0, "slots": { "main_armament": 6, "secondary_armament": 8, "utility": 12, "engine": 5 } },
            "battleship": { "name": "Encouraçado", "base_cost": 474000, "base_tonnage": 35000, "base_speed": 25, "displacement_mod": 2.5, "slots": { "main_armament": 8, "secondary_armament": 10, "utility": 14, "engine": 6 } },
            "escort_carrier": { "name": "Porta-Aviões de Escolta", "base_cost": 316000, "base_tonnage": 10000, "base_speed": 20, "displacement_mod": 1.2, "slots": { "secondary_armament": 4, "utility": 8, "engine": 3 } },
            "fleet_carrier": { "name": "Porta-Aviões de Esquadra", "base_cost": 1066500, "base_tonnage": 27000, "base_speed": 32, "displacement_mod": 2.2, "slots": { "secondary_armament": 8, "utility": 16, "engine": 6 } }
        },
        engines: {
            "steam_turbine": { "name": "Turbina a Vapor", "cost": 50000, "tonnage": 500, "power_generation": 100, "slots_required": 1, "stability_mod": -5 },
            "diesel": { "name": "Motor a Diesel", "cost": 80000, "tonnage": 450, "power_generation": 120, "slots_required": 1, "stability_mod": -3 },
            "diesel_electric": { "name": "Motor Eletro-diesel", "cost": 150000, "tonnage": 550, "power_generation": 150, "slots_required": 2, "stability_mod": -8 },
            "gas_turbine": { "name": "Turbina a Gás (Experimental)", "cost": 250000, "tonnage": 400, "power_generation": 200, "slots_required": 2, "stability_mod": -10 }
        },
        armor: {
            "none": { "name": "Sem Blindagem", "cost_per_mm_ton": 0, "tonnage_per_mm_ton": 0, "effectiveness": 0 },
            "harvey": { "name": "Harvey", "cost_per_mm_ton": 1.5, "tonnage_per_mm_ton": 2, "effectiveness": 0.8 },
            "krupp": { "name": "Krupp", "cost_per_mm_ton": 2.0, "tonnage_per_mm_ton": 2.5, "effectiveness": 1.0 },
            "kca": { "name": "KCA (Aço Krupp Cimentado)", "cost_per_mm_ton": 2.5, "tonnage_per_mm_ton": 3, "effectiveness": 1.2 },
            "homogeneous": { "name": "Homogênea", "cost_per_mm_ton": 2.25, "tonnage_per_mm_ton": 3, "effectiveness": 1.1 },
            "ducol": { "name": "Aço Ducol", "cost_per_mm_ton": 3.0, "tonnage_per_mm_ton": 2.8, "effectiveness": 1.15 }
        },
        armaments: {
            "gun_marks": {
                "I": { "name": "Mark I", "cost_mod": 1.0, "tonnage_mod": 1.0, "power_mod": 1.0, "slots_mod": 1.0, "accuracy_mod": 1.0 },
                "II": { "name": "Mark II", "cost_mod": 1.5, "tonnage_mod": 0.95, "power_mod": 1.1, "slots_mod": 1.0, "accuracy_mod": 1.1 },
                "III": { "name": "Mark III", "cost_mod": 2.5, "tonnage_mod": 0.9, "power_mod": 1.25, "slots_mod": 1.2, "accuracy_mod": 1.25 },
                "IV": { "name": "Mark IV", "cost_mod": 4.0, "tonnage_mod": 0.85, "power_mod": 1.4, "slots_mod": 1.3, "accuracy_mod": 1.4 },
                "V": { "name": "Mark V", "cost_mod": 7.0, "tonnage_mod": 0.8, "power_mod": 1.6, "slots_mod": 1.5, "accuracy_mod": 1.6 }
            },
            "torpedo_marks": {
                "I": { "name": "Mark I", "cost_mod": 1.0, "tonnage_mod": 1.0, "power_mod": 1.0, "slots_mod": 1.0, "damage_mod": 1.0 },
                "II": { "name": "Mark II", "cost_mod": 1.5, "tonnage_mod": 1.0, "power_mod": 1.2, "slots_mod": 1.0, "damage_mod": 1.2 },
                "III": { "name": "Mark III", "cost_mod": 2.2, "tonnage_mod": 1.1, "power_mod": 1.4, "slots_mod": 1.2, "damage_mod": 1.5 },
                "IV": { "name": "Mark IV (Oxigênio)", "cost_mod": 3.5, "tonnage_mod": 1.2, "power_mod": 1.6, "slots_mod": 1.5, "damage_mod": 2.0 }
            },
            "base_values": {
                "gun": { "cost_per_mm": 5, "tonnage_per_mm": 0.08, "power_draw_per_mm": 0.02, "firepower_per_mm": 0.2, "slots_per_turret": 1, "stability_penalty_per_ton": 0.1 },
                "torpedo": { "cost_per_tube": 15000, "tonnage_per_tube": 2, "power_draw_per_tube": 3, "slots_per_launcher": 1 }
            }
        },
        components: {
            "protection": {
                "title": "Proteção", "icon": "fa-shield-alt", "options": {
                    "bulkheads": { "name": "Anteparas (Bulkheads)", "type": "select", "options": { 
                        "1": { "name": "Mínima", "cost_mod": 0.95, "tonnage_mod": 0.95, "reliability_mod": 0.95, "stability_mod": -5 }, 
                        "2": { "name": "Padrão", "cost_mod": 1.0, "tonnage_mod": 1.0, "reliability_mod": 1.0, "stability_mod": 0 }, 
                        "3": { "name": "Reforçada", "cost_mod": 1.1, "tonnage_mod": 1.1, "reliability_mod": 1.05, "stability_mod": 5 }, 
                        "4": { "name": "Máxima", "cost_mod": 1.2, "tonnage_mod": 1.2, "reliability_mod": 1.1, "stability_mod": 10 } } 
                    },
                    "anti_torpedo": { "name": "Proteção Anti-Torpedo", "type": "select", "options": { "none": { "name": "Nenhuma", "cost": 0, "tonnage": 0, "slots": 0 }, "basic": { "name": "Básica", "cost": 75000, "tonnage": 150, "slots": 2 }, "advanced": { "name": "Avançada", "cost": 150000, "tonnage": 300, "slots": 3 } } },
                    "anti_flood": { "name": "Proteção Anti-Alagamento", "type": "select", "options": { "none": { "name": "Nenhuma", "cost": 0, "tonnage": 0, "slots": 0 }, "basic": { "name": "Básica", "cost": 45000, "tonnage": 100, "slots": 2 }, "advanced": { "name": "Avançada", "cost": 90000, "tonnage": 200, "slots": 3 } } }
                }
            },
            "fire_control": {
                "title": "Controle de Tiro", "icon": "fa-crosshairs", "options": {
                    "rangefinder": { "name": "Telêmetro", "type": "select", "options": { 
                        "none": { "name": "Nenhum", "cost": 0, "tonnage": 0, "slots": 0, "accuracy_mod": 1.0, "power_draw": 0 }, 
                        "optical": { "name": "Óptico", "cost": 40000, "tonnage": 5, "slots": 1, "accuracy_mod": 1.05, "power_draw": 2 }, 
                        "stereoscopic": { "name": "Estereoscópico", "cost": 80000, "tonnage": 8, "slots": 1, "accuracy_mod": 1.1, "power_draw": 5 } } 
                    },
                    "fire_control_system": { "name": "Sistema de Controle de Tiro", "type": "select", "options": { 
                        "none": { "name": "Nenhum", "cost": 0, "tonnage": 0, "slots": 0, "accuracy_mod": 1.0, "power_draw": 0 }, 
                        "analog": { "name": "Computador Analógico", "cost": 150000, "tonnage": 15, "slots": 2, "accuracy_mod": 1.15, "power_draw": 15 }, 
                        "advanced": { "name": "Radar de Controle de Fogo", "cost": 250000, "tonnage": 25, "slots": 3, "accuracy_mod": 1.25, "power_draw": 30 } } 
                    }
                }
            },
            "sensors": {
                "title": "Sensores", "icon": "fa-satellite-dish", "options": {
                    "radar": { "name": "Radar", "type": "select", "options": { "none": { "name": "Nenhum", "cost": 0, "tonnage": 0, "slots": 0, "power_draw": 0 }, "search": { "name": "Radar de Busca", "cost": 105000, "tonnage": 15, "slots": 2, "power_draw": 20 }, "advanced_search": { "name": "Radar de Busca Avançado", "cost": 200000, "tonnage": 20, "slots": 2, "power_draw": 25 } } },
                    "sonar": { "name": "Sonar", "type": "select", "options": { "none": { "name": "Nenhum", "cost": 0, "tonnage": 0, "slots": 0, "power_draw": 0 }, "passive": { "name": "Passivo (Hidrofone)", "cost": 50000, "tonnage": 5, "slots": 1, "power_draw": 5 }, "active": { "name": "Ativo (ASDIC)", "cost": 105000, "tonnage": 10, "slots": 2, "power_draw": 15 } } },
                    "radio": { "name": "Comunicações", "type": "select", "options": { "telegraph": { "name": "Telégrafo", "cost": 15500, "tonnage": 3, "slots": 1, "power_draw": 1 }, "radio": { "name": "Rádio de Longo Alcance", "cost": 30000, "tonnage": 5, "slots": 1, "power_draw": 5 }, "crypto": { "name": "Rádio com Criptografia", "cost": 75000, "tonnage": 8, "slots": 2, "power_draw": 10 } } }
                }
            }
        },
        doctrines: {
            "decisive_battle": { "name": "Batalha Decisiva", "cost_modifier": 1.2, "performance_bonus": { "firepower": 1.15, "armor": 1.10 } },
            "convoy_warfare": { "name": "Guerra de Comboios", "cost_modifier": 0.9, "performance_bonus": { "asw": 1.2, "range": 1.1 } },
            "power_projection": { "name": "Poder de Projeção", "cost_modifier": 1.25, "performance_bonus": { "aa": 1.1 } },
            "submarine_warfare": { "name": "Guerra Submarina", "cost_modifier": 0.95, "performance_bonus": { "torpedo": 1.15 } },
            "fleet_in_being": { "name": "Frota em Potencial", "cost_modifier": 1.1, "performance_bonus": { "all": 1.05 } },
            "commerce_raiding": { "name": "Guerra ao Comércio", "cost_modifier": 1.0, "performance_bonus": { "speed": 1.15, "range": 1.2 } }
        },
        countries: {}
    },
    state: {
        shipName: "Novo Projeto",
        country: null,
        doctrine: null,
        hull: null,
        engine: null, 
        sliders: {
            displacement: 100,
            speed: 25,
            range: 8000
        },
        armor: { type: 'none', thickness: 0 },
        armaments: [],
        components: {}
    },
    sheetUrls: {
        country_stats: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Pw3aRXSTIGMglyNAUNqLtOl7wjX9bMeFXEASkQYC34g_zDyDx3LE8Vm73FUoNn27UAlKLizQBXBO/pub?gid=0&single=true&output=csv',
        naval_capacity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Pw3aRXSTIGMglyNAUNqLtOl7wjX9bMeFXEASkQYC34g_zDyDx3LE8Vm73FUoNn27UAlKLizQBXBO/pub?gid=580175793&single=true&output=csv'
    }
};

// =================================================================================
// INICIALIZAÇÃO E CARREGAMENTO DE DADOS
// =================================================================================

APP.init = async () => {
    console.log("Inicializando Construtor Naval...");
    await APP.loadSheetData();
    APP.setupUi();
    APP.updateCalculations();
    console.log("Construtor Naval Pronto.", APP.data);
};

APP.loadSheetData = async () => {
    try {
        const [countryStatsRaw, navalCapacityRaw] = await Promise.all([
            APP.parseCSV(APP.sheetUrls.country_stats),
            APP.parseCSV(APP.sheetUrls.naval_capacity)
        ]);
        const countriesData = {};
        countryStatsRaw.forEach(row => {
            const countryName = row['País'];
            if (countryName) {
                countriesData[countryName] = {
                    name: countryName,
                    tech_naval: parseFloat(row['Marinha'].replace(',', '.')) || 50,
                    production_capacity: 0
                };
            }
        });
        navalCapacityRaw.forEach(row => {
            const countryName = row['País'];
            if (countriesData[countryName]) {
                countriesData[countryName].production_capacity = parseFloat(row['Capacidade de produção'].replace(/\./g, '').replace(',', '.')) || 1000000;
            }
        });
        countriesData["Genérico / Padrão"] = { name: "Genérico / Padrão", production_capacity: 100000000, tech_naval: 50 };
        APP.data.countries = countriesData;
    } catch (error) {
        console.warn("Não foi possível carregar dados das planilhas. Usando dados de fallback.", error);
        APP.data.countries = { "Genérico / Falha": { name: "Genérico / Falha", production_capacity: 100000000, tech_naval: 50 } };
    }
};

APP.parseCSV = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro no fetch do CSV: ${url}`);
    const csvText = await response.text();
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        let row = {};
        headers.forEach((header, i) => { row[header] = values[i] || ''; });
        return row;
    });
};

// =================================================================================
// CONFIGURAÇÃO DA INTERFACE (UI)
// =================================================================================

APP.setupUi = () => {
    APP.populateSelect('country', Object.keys(APP.data.countries));
    APP.populateSelect('naval_doctrine', Object.keys(APP.data.doctrines).map(key => APP.data.doctrines[key].name), Object.keys(APP.data.doctrines));
    APP.populateSelect('hull_type', Object.keys(APP.data.hulls).map(key => APP.data.hulls[key].name), Object.keys(APP.data.hulls));
    APP.populateSelect('engine_type', Object.keys(APP.data.engines).map(key => APP.data.engines[key].name), Object.keys(APP.data.engines));
    APP.populateSelect('armor_type', Object.keys(APP.data.armor).map(key => APP.data.armor[key].name), Object.keys(APP.data.armor));
    APP.populateSelect('gun_mark', Object.keys(APP.data.armaments.gun_marks).map(key => APP.data.armaments.gun_marks[key].name), Object.keys(APP.data.armaments.gun_marks));
    APP.populateSelect('torpedo_mark', Object.keys(APP.data.armaments.torpedo_marks).map(key => APP.data.armaments.torpedo_marks[key].name), Object.keys(APP.data.armaments.torpedo_marks));

    APP.setupComponentSelectors();
    APP.addEventListeners();
};

APP.setupComponentSelectors = () => {
    const protectionContainer = document.getElementById('protection_components');
    const fireControlContainer = document.getElementById('fire_control_components');
    const sensorsContainer = document.getElementById('sensors_components');
    
    protectionContainer.innerHTML = APP.createComponentSelectorsHTML(APP.data.components.protection);
    fireControlContainer.innerHTML = APP.createComponentSelectorsHTML(APP.data.components.fire_control);
    sensorsContainer.innerHTML = APP.createComponentSelectorsHTML(APP.data.components.sensors);
};

APP.createComponentSelectorsHTML = (category) => {
    let html = `<h4 class="component-category-title"><i class="fas ${category.icon} mr-2"></i>${category.title}</h4>`;
    for (const key in category.options) {
        const option = category.options[key];
        html += `<div class="form-group"><label for="comp_${key}">${option.name}</label><select id="comp_${key}" data-category="${category.title.toLowerCase().replace(' ', '_')}" data-key="${key}" class="input-style">`;
        for (const subKey in option.options) {
            html += `<option value="${subKey}">${option.options[subKey].name}</option>`;
        }
        html += `</select></div>`;
    }
    return html;
};

APP.addEventListeners = () => {
    document.getElementById('ship_name').addEventListener('input', e => { APP.state.shipName = e.target.value; APP.updateCalculations(); });
    document.getElementById('country').addEventListener('change', e => { APP.state.country = e.target.value; APP.updateCalculations(); });
    document.getElementById('naval_doctrine').addEventListener('change', e => { APP.state.doctrine = e.target.value; APP.updateCalculations(); });
    document.getElementById('hull_type').addEventListener('change', e => { APP.state.hull = e.target.value; APP.updateCalculations(); });
    document.getElementById('engine_type').addEventListener('change', e => { APP.state.engine = e.target.value; APP.updateCalculations(); });
    document.getElementById('armor_type').addEventListener('change', e => { APP.state.armor.type = e.target.value; APP.updateCalculations(); });
    document.getElementById('armor_thickness').addEventListener('input', e => { APP.state.armor.thickness = parseInt(e.target.value) || 0; APP.updateCalculations(); });
    
    document.getElementById('displacement_slider').addEventListener('input', e => { APP.state.sliders.displacement = parseInt(e.target.value); APP.updateCalculations(); });
    document.getElementById('speed_slider').addEventListener('input', e => { APP.state.sliders.speed = parseInt(e.target.value); APP.updateCalculations(); });
    document.getElementById('range_slider').addEventListener('input', e => { APP.state.sliders.range = parseInt(e.target.value); APP.updateCalculations(); });

    document.getElementById('add_gun_button').addEventListener('click', APP.addGun);
    document.getElementById('add_torpedo_button').addEventListener('click', APP.addTorpedo);
    document.getElementById('save_design_button').addEventListener('click', APP.saveAndShowSheet);
    document.getElementById('export_design_button').addEventListener('click', APP.exportDesign);
    document.getElementById('import_design_button').addEventListener('click', APP.importDesign);
    
    document.querySelectorAll('[id^="comp_"]').forEach(select => {
        select.addEventListener('change', e => {
            const key = e.target.dataset.key;
            const value = e.target.value;
            APP.state.components[key] = value;
            APP.updateCalculations();
        });
    });
};

APP.populateSelect = (selectId, options, values = options) => {
    const select = document.getElementById(selectId);
    select.innerHTML = `<option value="">Selecione...</option>`;
    options.forEach((option, index) => {
        select.innerHTML += `<option value="${values[index]}">${option}</option>`;
    });
};

// =================================================================================
// LÓGICA DE MANIPULAÇÃO DE ESTADO
// =================================================================================

APP.addGun = () => {
    const caliber = parseInt(document.getElementById('gun_caliber').value);
    const turrets = parseInt(document.getElementById('gun_turrets').value);
    const barrels = parseInt(document.getElementById('gun_barrels').value);
    const mark = document.getElementById('gun_mark').value;
    if (!caliber || !turrets || !barrels || !mark) { alert("Preencha todos os campos da torre."); return; }
    APP.state.armaments.push({ id: `gun_${Date.now()}`, type: 'gun_turret', caliber, turrets, barrels, mark });
    APP.updateCalculations();
};

APP.addTorpedo = () => {
    const tubes = parseInt(document.getElementById('torpedo_tubes').value);
    const mark = document.getElementById('torpedo_mark').value;
    if (!tubes || !mark) { alert("Preencha todos os campos do lançador."); return; }
    APP.state.armaments.push({ id: `torpedo_${Date.now()}`, type: 'torpedo_launcher', tubes, mark });
    APP.updateCalculations();
};

APP.removeArmament = (armamentId) => {
    APP.state.armaments = APP.state.armaments.filter(arm => arm.id !== armamentId);
    APP.updateCalculations();
};

// =================================================================================
// CÁLCULO PRINCIPAL
// =================================================================================

APP.getCalculatedTotals = () => {
    if (!APP.state.hull) { return null; }
    const hullData = APP.data.hulls[APP.state.hull];
    if (!hullData) return null;

    const displacementMultiplier = APP.state.sliders.displacement / 100;
    const modifiedTonnage = hullData.base_tonnage * displacementMultiplier;
    const modifiedCost = hullData.base_cost * Math.pow(displacementMultiplier, 2.0); // Custo escala com o quadrado do tamanho
    const modifiedSlots = {
        armament: Math.floor((hullData.slots.main_armament + hullData.slots.secondary_armament) * displacementMultiplier),
        utility: Math.floor(hullData.slots.utility * displacementMultiplier)
    };

    let total = {
        cost: modifiedCost,
        tonnage: modifiedTonnage,
        power_gen: 0,
        power_draw: 0,
        slots_armament: { used: 0, max: modifiedSlots.armament },
        slots_utility: { used: 0, max: modifiedSlots.utility },
        reliability_mod: 1.0,
        accuracy_mod: 1.0,
        stability: 100,
        firepower: 0
    };

    const targetSpeed = APP.state.sliders.speed;
    const requiredPower = (total.tonnage / 1500) * Math.pow(targetSpeed / 10, 2.5); // Requisito de potência mais agressivo

    const selectedEngineData = APP.data.engines[APP.state.engine];
    if (selectedEngineData) {
        total.cost += selectedEngineData.cost;
        total.tonnage += selectedEngineData.tonnage;
        total.power_gen += selectedEngineData.power_generation;
        total.slots_utility.used += selectedEngineData.slots_required;
        total.engineName = selectedEngineData.name;
        total.stability += selectedEngineData.stability_mod || 0;
    }

    const rangeTonnage = (APP.state.sliders.range / 1000) * (hullData.displacement_mod || 1);
    total.tonnage += rangeTonnage;
    total.cost += rangeTonnage * 50;

    if (APP.state.armor.type !== 'none' && APP.state.armor.thickness > 0) {
        const armorData = APP.data.armor[APP.state.armor.type];
        const surfaceAreaProxy = Math.pow(modifiedTonnage, 0.667);
        const armorTonnage = armorData.tonnage_per_mm_ton * APP.state.armor.thickness * (surfaceAreaProxy / 150);
        total.cost += armorData.cost_per_mm_ton * APP.state.armor.thickness * (surfaceAreaProxy / 150);
        total.tonnage += armorTonnage;
        total.stability -= (armorTonnage / 1000);
    }
    
    for (const key in APP.state.components) {
        const categoryKey = Object.keys(APP.data.components).find(cKey => APP.data.components[cKey].options[key]);
        if (categoryKey) {
            const compData = APP.data.components[categoryKey].options[key].options[APP.state.components[key]];
            if(compData) {
                total.cost += compData.cost || 0;
                total.tonnage += compData.tonnage || 0;
                total.power_draw += compData.power_draw || 0;
                total.slots_utility.used += compData.slots || 0;
                if (compData.reliability_mod) total.reliability_mod *= compData.reliability_mod;
                if (compData.accuracy_mod) total.accuracy_mod *= compData.accuracy_mod;
                if (compData.stability_mod) total.stability += compData.stability_mod;
            }
        }
    }

    APP.state.armaments.forEach(arm => {
        if (arm.type === 'gun_turret') {
            const markData = APP.data.armaments.gun_marks[arm.mark];
            const base = APP.data.armaments.base_values.gun;
            const totalGuns = arm.turrets * arm.barrels;
            const gunTonnage = base.tonnage_per_mm * arm.caliber * totalGuns * markData.tonnage_mod;
            total.cost += base.cost_per_mm * arm.caliber * totalGuns * markData.cost_mod;
            total.tonnage += gunTonnage;
            total.power_draw += base.power_draw_per_mm * arm.caliber * totalGuns * markData.power_mod;
            total.slots_armament.used += base.slots_per_turret * arm.turrets * markData.slots_mod;
            total.firepower += base.firepower_per_mm * arm.caliber * totalGuns; // Precisão do Mark agora afeta o final
            total.stability -= gunTonnage * base.stability_penalty_per_ton;
        } else if (arm.type === 'torpedo_launcher') {
            const markData = APP.data.armaments.torpedo_marks[arm.mark];
            const base = APP.data.armaments.base_values.torpedo;
            total.cost += base.cost_per_tube * arm.tubes * markData.cost_mod;
            total.tonnage += base.tonnage_per_tube * arm.tubes * markData.tonnage_mod;
            total.power_draw += base.power_draw_per_tube * arm.tubes * markData.power_mod;
            total.slots_armament.used += base.slots_per_launcher * markData.slots_mod;
            total.firepower += markData.damage_mod * 50 * arm.tubes;
        }
    });

    total.finalReliability = Math.min(100, 100 * total.reliability_mod);
    total.finalSpeed = targetSpeed * Math.min(1, total.power_gen / requiredPower);
    total.maxTonnage = hullData.base_tonnage * (APP.state.sliders.displacement / 100) * 1.25;
    total.finalStability = Math.max(0, Math.round(total.stability));
    total.finalAccuracy = Math.round(100 * total.accuracy_mod * (total.finalStability / 100)); // Estabilidade afeta precisão
    total.finalFirepower = Math.round(total.firepower * total.accuracy_mod);

    return total;
}

APP.updateCalculations = () => {
    const totals = APP.getCalculatedTotals();
    if (totals) {
        APP.updateUi(totals);
    }
};

// =================================================================================
// ATUALIZAÇÃO DA UI
// =================================================================================

APP.updateUi = (totals) => {
    const hullData = APP.data.hulls[APP.state.hull];
    if (!hullData) return;

    document.getElementById('displacement_value_label').textContent = `${APP.state.sliders.displacement}%`;
    document.getElementById('speed_value_label').textContent = `${APP.state.sliders.speed} nós`;
    document.getElementById('range_value_label').textContent = `${APP.state.sliders.range.toLocaleString('pt-BR')} km`;

    document.getElementById('display_name').textContent = APP.state.shipName || "Novo Projeto";
    document.getElementById('display_class').textContent = hullData.name;
    document.getElementById('display_cost').textContent = `£${Math.round(totals.cost).toLocaleString('pt-BR')}`;
    document.getElementById('display_speed').textContent = `${totals.finalSpeed.toFixed(1)} nós`;
    document.getElementById('display_reliability').textContent = `${Math.round(totals.finalReliability)}%`;
    document.getElementById('display_accuracy').textContent = `${totals.finalAccuracy}%`;
    document.getElementById('display_stability').textContent = `${totals.finalStability}%`;

    APP.updateProgressBar('tonnage', totals.tonnage, totals.maxTonnage);
    APP.updateProgressBar('armament_slots', totals.slots_armament.used, totals.slots_armament.max);
    APP.updateProgressBar('utility_slots', totals.slots_utility.used, totals.slots_utility.max);
    APP.updateProgressBar('power', totals.power_draw, totals.power_gen);

    const armamentList = document.getElementById('armament_list');
    armamentList.innerHTML = '';
    APP.state.armaments.forEach(arm => {
        let text = arm.type === 'gun_turret' 
            ? `${arm.turrets}x Torre(s) c/ ${arm.barrels} Canhão(s) de ${arm.caliber}mm (${arm.mark})`
            : `1x Lançador c/ ${arm.tubes} Torpedo(s) (${arm.mark})`;
        const div = document.createElement('div');
        div.className = 'item-row';
        div.innerHTML = `<span>${text}</span><button class="btn-danger" onclick="APP.removeArmament('${arm.id}')"><i class="fas fa-trash"></i></button>`;
        armamentList.appendChild(div);
    });

    const statusPanel = document.getElementById('status_panel');
    let warnings = [];
    if (totals.tonnage > totals.maxTonnage) warnings.push("Excesso de peso crítico!");
    if (totals.slots_armament.used > totals.slots_armament.max) warnings.push("Slots de armamento excedidos!");
    if (totals.slots_utility.used > totals.slots_utility.max) warnings.push("Slots de utilidade excedidos!");
    if (totals.power_draw > totals.power_gen) warnings.push("Déficit de energia!");
    if (totals.finalStability < 50) warnings.push("Estabilidade perigosamente baixa!");
    if (totals.finalSpeed < APP.state.sliders.speed * 0.95) warnings.push("Motor fraco para a velocidade alvo!");


    statusPanel.className = `status-indicator ${warnings.length > 0 ? 'status-error' : 'status-ok'}`;
    statusPanel.textContent = warnings.length > 0 ? warnings.join(' ') : "Projeto dentro dos parâmetros.";
};

APP.updateProgressBar = (id, current, max) => {
    const display = document.getElementById(`${id}_display`);
    const bar = document.getElementById(`${id}_bar`);
    current = Math.round(current);
    max = Math.round(max);
    display.textContent = `${current.toLocaleString('pt-BR')} / ${max.toLocaleString('pt-BR')}`;
    const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;
    bar.style.width = `${percentage}%`;
    bar.style.backgroundColor = current > max ? '#ef4444' : (current > max * 0.85 ? '#f59e0b' : '#3b82f6');
};

// =================================================================================
// GERENCIAMENTO DE PROJETO
// =================================================================================

APP.saveAndShowSheet = () => {
    if (!APP.state.hull) {
        alert("Selecione um casco antes de finalizar o projeto.");
        return;
    }
    const finalData = {
        state: APP.state,
        calculated: APP.getCalculatedTotals(),
        data: {
            hulls: APP.data.hulls,
            doctrines: APP.data.doctrines,
            components: APP.data.components,
            armaments: APP.data.armaments,
            armor: APP.data.armor,
            engines: APP.data.engines
        }
    };
    
    localStorage.setItem('shipSheetData', JSON.stringify(finalData));
    window.open('ship_sheet.html', '_blank');
};

APP.exportDesign = () => {
    const jsonString = JSON.stringify(APP.state, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
        alert("Código do projeto copiado para a área de transferência!");
    }).catch(err => {
        console.error('Erro ao copiar texto: ', err);
        prompt("Não foi possível copiar automaticamente. Copie este código:", jsonString);
    });
};

APP.importDesign = () => {
    const jsonString = prompt("Cole o código do projeto aqui:");
    if (jsonString) {
        try {
            const newState = JSON.parse(jsonString);
            APP.loadState(newState);
        } catch (error) {
            alert("Erro ao ler o código do projeto. Formato inválido.");
            console.error("Erro de importação:", error);
        }
    }
};

APP.loadState = (newState) => {
    APP.state = {
        ...{ 
            shipName: "Novo Projeto Importado",
            country: null, doctrine: null, hull: null, engine: null,
            sliders: { displacement: 100, speed: 25, range: 8000 },
            armor: { type: 'none', thickness: 0 },
            armaments: [],
            components: {}
        }, 
        ...newState
    };
    
    document.getElementById('ship_name').value = APP.state.shipName;
    document.getElementById('country').value = APP.state.country;
    document.getElementById('naval_doctrine').value = APP.state.doctrine;
    document.getElementById('hull_type').value = APP.state.hull;
    document.getElementById('engine_type').value = APP.state.engine;
    document.getElementById('armor_type').value = APP.state.armor.type;
    document.getElementById('armor_thickness').value = APP.state.armor.thickness;
    
    document.getElementById('displacement_slider').value = APP.state.sliders.displacement;
    document.getElementById('speed_slider').value = APP.state.sliders.speed;
    document.getElementById('range_slider').value = APP.state.sliders.range;
    
    for (const key in APP.data.components) {
        for (const subKey in APP.data.components[key].options) {
             const select = document.getElementById(`comp_${subKey}`);
             if(select) {
                 select.value = APP.state.components[subKey] || Object.keys(APP.data.components[key].options[subKey].options)[0];
             }
        }
    }
    
    APP.updateCalculations();
};


document.addEventListener('DOMContentLoaded', APP.init);
