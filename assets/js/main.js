// =================================================================================
// CONSTRUTOR NAVAL AVANÇADO - LÓGICA PRINCIPAL (BALANCEAMENTO V3)
// =================================================================================

const APP = {
    data: {
        hulls: {
            "submarine": { "name": "Submarino", "base_cost": 35550, "base_tonnage": 600, "base_speed": 15, "displacement_mod": 0.5, "max_speed": 25, "min_engine_slots": 1, "max_engine_slots": 2, "min_boiler_slots": 1, "max_boiler_slots": 2, "base_maneuverability": 90, "slots": { "main_armament": 1, "secondary_armament": 2, "torpedo": 4, "utility": 4 } },
            "destroyer": { "name": "Contratorpedeiro", "base_cost": 59250, "base_tonnage": 1500, "base_speed": 35, "displacement_mod": 1.0, "max_speed": 45, "min_engine_slots": 1, "max_engine_slots": 4, "min_boiler_slots": 1, "max_boiler_slots": 4, "base_maneuverability": 85, "slots": { "main_armament": 2, "secondary_armament": 4, "torpedo": 2, "asw": 2, "utility": 6 } },
            "light_cruiser": { "name": "Cruzador Leve", "base_cost": 118500, "base_tonnage": 4000, "base_speed": 32, "displacement_mod": 1.2, "max_speed": 38, "min_engine_slots": 2, "max_engine_slots": 6, "min_boiler_slots": 2, "max_boiler_slots": 6, "base_maneuverability": 75, "slots": { "main_armament": 3, "secondary_armament": 6, "torpedo": 2, "asw": 1, "utility": 8 } },
            "heavy_cruiser": { "name": "Cruzador Pesado", "base_cost": 237000, "base_tonnage": 10000, "base_speed": 30, "displacement_mod": 1.5, "max_speed": 35, "min_engine_slots": 3, "max_engine_slots": 8, "min_boiler_slots": 3, "max_boiler_slots": 8, "base_maneuverability": 65, "slots": { "main_armament": 4, "secondary_armament": 8, "torpedo": 2, "utility": 10 } },
            "battle_cruiser": { "name": "Cruzador de Batalha", "base_cost": 355500, "base_tonnage": 25000, "base_speed": 30, "displacement_mod": 2.0, "max_speed": 33, "min_engine_slots": 4, "max_engine_slots": 10, "min_boiler_slots": 4, "max_boiler_slots": 10, "base_maneuverability": 55, "slots": { "main_armament": 6, "secondary_armament": 8, "utility": 12 } },
            "battleship": { "name": "Encouraçado", "base_cost": 474000, "base_tonnage": 45000, "base_speed": 25, "displacement_mod": 2.5, "max_speed": 30, "min_engine_slots": 4, "max_engine_slots": 12, "min_boiler_slots": 4, "max_boiler_slots": 12, "base_maneuverability": 40, "slots": { "main_armament": 8, "secondary_armament": 10, "utility": 14 } },
            "escort_carrier": { "name": "Porta-Aviões de Escolta", "base_cost": 316000, "base_tonnage": 10000, "base_speed": 20, "displacement_mod": 1.2, "max_speed": 28, "min_engine_slots": 2, "max_engine_slots": 6, "min_boiler_slots": 2, "max_boiler_slots": 6, "base_maneuverability": 60, "slots": { "secondary_armament": 4, "utility": 8 } },
            "fleet_carrier": { "name": "Porta-Aviões de Esquadra", "base_cost": 1066500, "base_tonnage": 27000, "base_speed": 32, "displacement_mod": 2.2, "max_speed": 34, "min_engine_slots": 4, "max_engine_slots": 10, "min_boiler_slots": 4, "max_boiler_slots": 10, "base_maneuverability": 50, "slots": { "secondary_armament": 8, "utility": 16 } }
        },
        // Novas categorias de propulsão
        fuels: {
            "coal": { "name": "Carvão", "cost_mod": 0.8, "tonnage_mod": 1.2, "power_mod": 0.9, "range_factor": 0.8, "reliability_mod": 0.95 },
            "semi_oil": { "name": "Semi-Óleo", "cost_mod": 1.0, "tonnage_mod": 1.0, "power_mod": 1.0, "range_factor": 1.0, "reliability_mod": 1.0 },
            "diesel_fuel": { "name": "Diesel", "cost_mod": 1.5, "tonnage_mod": 0.8, "power_mod": 1.1, "range_factor": 1.2, "reliability_mod": 1.05 }
        },
        boilers: {
            "natural": { "name": "Naturais", "cost_per_unit": 10000, "tonnage_per_unit": 50, "power_per_unit": 20, "reliability_mod": 1.0 },
            "induced": { "name": "Induzidas", "cost_per_unit": 15000, "tonnage_per_unit": 60, "power_per_unit": 25, "reliability_mod": 0.98 },
            "forced": { "name": "Forçadas", "cost_per_unit": 20000, "tonnage_per_unit": 70, "power_per_unit": 30, "reliability_mod": 0.95 },
            "balanced": { "name": "Balanceadas", "cost_per_unit": 25000, "tonnage_per_unit": 65, "power_per_unit": 28, "reliability_mod": 1.02 }
        },
        main_engines: { // Renamed from 'engines'
            "steam_turbine": { "name": "Turbina a Vapor", "cost_per_unit": 50000, "tonnage_per_unit": 500, "base_power_per_unit": 100, "stability_mod_per_unit": -5, "maneuverability_mod_per_unit": -2 },
            "diesel": { "name": "Motor a Diesel", "cost_per_unit": 80000, "tonnage_per_unit": 450, "base_power_per_unit": 120, "stability_mod_per_unit": -3, "maneuverability_mod_per_unit": 0 },
            "diesel_electric": { "name": "Motor Eletro-diesel", "cost_per_unit": 150000, "tonnage_per_unit": 550, "base_power_per_unit": 150, "stability_mod_per_unit": -8, "maneuverability_mod_per_unit": 5 },
            "gas_turbine": { "name": "Turbina a Gás (Experimental)", "cost_per_unit": 250000, "tonnage_per_unit": 400, "base_power_per_unit": 200, "stability_mod_per_unit": -10, "maneuverability_mod_per_unit": 8 }
        },
        auxiliaries: {
            "none": { "name": "Nenhum", "cost": 0, "tonnage": 0, "power_add": 0, "reliability_mod": 1.0, "maneuverability_mod": 1.0, "slots_required": 0 },
            "gasoline_gen": { "name": "Motor a Gasolina (Gerador)", "cost": 15000, "tonnage": 10, "power_add": 10, "reliability_mod": 0.98, "maneuverability_mod": 0.98, "slots_required": 1 },
            "diesel_gen": { "name": "Motor a Diesel (Gerador)", "cost": 25000, "tonnage": 15, "power_add": 15, "reliability_mod": 1.0, "maneuverability_mod": 1.0, "slots_required": 1 },
            "diesel_electric_gen": { "name": "Eletro-diesel (Gerador)", "cost": 40000, "tonnage": 20, "power_add": 25, "reliability_mod": 1.02, "maneuverability_mod": 1.05, "slots_required": 2 }
        },
        propellers: {
            "twin": { "name": "Duplas", "cost_mod": 1.0, "tonnage_mod": 1.0, "efficiency": 1.0, "stability_mod": 0, "maneuverability_mod": 1.0 },
            "triple": { "name": "Triplas", "cost_mod": 1.2, "tonnage_mod": 1.1, "efficiency": 1.05, "stability_mod": -2, "maneuverability_mod": 1.02 },
            "quad": { "name": "Quádruplas", "cost_mod": 1.5, "tonnage_mod": 1.2, "efficiency": 1.1, "stability_mod": -5, "maneuverability_mod": 1.05 }
        },
        steering_mechanism: {
            "steam": { "name": "A Vapor", "cost": 10000, "tonnage": 5, "reliability_mod": 0.95, "stability_mod": 0, "maneuverability_mod": 0.9 },
            "hydraulic": { "name": "Hidráulica", "cost": 25000, "tonnage": 8, "reliability_mod": 1.0, "stability_mod": 1, "maneuverability_mod": 1.0 },
            "electric": { "name": "Elétrica", "cost": 40000, "tonnage": 10, "reliability_mod": 1.02, "stability_mod": 2, "maneuverability_mod": 1.1 },
            "electro_hydraulic": { "name": "Eletro-hidráulica", "cost": 60000, "tonnage": 12, "reliability_mod": 1.05, "stability_mod": 3, "maneuverability_mod": 1.15 }
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
        // Novas propriedades de propulsão
        fuel_type: null,
        boiler_type: null,
        number_of_boilers: 1,
        main_engine_type: null,
        number_of_main_engines: 1,
        auxiliary_engine_type: 'none',
        propeller_type: null,
        steering_mechanism_type: null,
        // Sliders
        sliders: {
            displacement: 100,
            speed: 25, // Velocidade alvo inicial
            range: 8000 // Alcance alvo inicial
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
    
    // Novos seletores de propulsão
    APP.populateSelect('fuel_type', Object.keys(APP.data.fuels).map(key => APP.data.fuels[key].name), Object.keys(APP.data.fuels));
    APP.populateSelect('boiler_type', Object.keys(APP.data.boilers).map(key => APP.data.boilers[key].name), Object.keys(APP.data.boilers));
    APP.populateSelect('main_engine_type', Object.keys(APP.data.main_engines).map(key => APP.data.main_engines[key].name), Object.keys(APP.data.main_engines));
    APP.populateSelect('auxiliary_engine_type', Object.keys(APP.data.auxiliaries).map(key => APP.data.auxiliaries[key].name), Object.keys(APP.data.auxiliaries));
    APP.populateSelect('propeller_type', Object.keys(APP.data.propellers).map(key => APP.data.propellers[key].name), Object.keys(APP.data.propellers));
    APP.populateSelect('steering_mechanism_type', Object.keys(APP.data.steering_mechanism).map(key => APP.data.steering_mechanism[key].name), Object.keys(APP.data.steering_mechanism));

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
        html += `<div class="form-group"><label for="comp_${key}">${option.name}</label><select id="comp_${key}" data-category="${category.title.toLowerCase().replace(/ /g, '_')}" data-key="${key}" class="input-style">`;
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
    
    document.getElementById('hull_type').addEventListener('change', e => { 
        APP.state.hull = e.target.value; 
        // Atualiza o limite máximo do slider de velocidade com base no casco
        const hullData = APP.data.hulls[APP.state.hull];
        const speedSlider = document.getElementById('speed_slider');
        if (hullData) {
            speedSlider.max = hullData.max_speed;
            if (APP.state.sliders.speed > hullData.max_speed) {
                APP.state.sliders.speed = hullData.max_speed;
                speedSlider.value = hullData.max_speed;
            }
            // Define valores padrão para os novos seletores se não estiverem definidos
            APP.state.fuel_type = APP.state.fuel_type || Object.keys(APP.data.fuels)[0];
            APP.state.boiler_type = APP.state.boiler_type || Object.keys(APP.data.boilers)[0];
            APP.state.main_engine_type = APP.state.main_engine_type || Object.keys(APP.data.main_engines)[0];
            APP.state.auxiliary_engine_type = APP.state.auxiliary_engine_type || 'none';
            APP.state.propeller_type = APP.state.propeller_type || Object.keys(APP.data.propellers)[0];
            APP.state.steering_mechanism_type = APP.state.steering_mechanism_type || Object.keys(APP.data.steering_mechanism)[0];

            // Atualiza a UI dos novos seletores
            document.getElementById('fuel_type').value = APP.state.fuel_type;
            document.getElementById('boiler_type').value = APP.state.boiler_type;
            document.getElementById('main_engine_type').value = APP.state.main_engine_type;
            document.getElementById('auxiliary_engine_type').value = APP.state.auxiliary_engine_type;
            document.getElementById('propeller_type').value = APP.state.propeller_type;
            document.getElementById('steering_mechanism_type').value = APP.state.steering_mechanism_type;

            // Define os limites para o número de motores/caldeiras
            document.getElementById('number_of_boilers').min = hullData.min_boiler_slots;
            document.getElementById('number_of_boilers').max = hullData.max_boiler_slots;
            document.getElementById('number_of_main_engines').min = hullData.min_engine_slots;
            document.getElementById('number_of_main_engines').max = hullData.max_engine_slots;
            
            // Garante que os valores atuais estejam dentro dos novos limites
            if (APP.state.number_of_boilers < hullData.min_boiler_slots) APP.state.number_of_boilers = hullData.min_boiler_slots;
            if (APP.state.number_of_boilers > hullData.max_boiler_slots) APP.state.number_of_boilers = hullData.max_boiler_slots;
            if (APP.state.number_of_main_engines < hullData.min_engine_slots) APP.state.number_of_main_engines = hullData.min_engine_slots;
            if (APP.state.number_of_main_engines > hullData.max_engine_slots) APP.state.number_of_main_engines = hullData.max_engine_slots;
            
            document.getElementById('number_of_boilers').value = APP.state.number_of_boilers;
            document.getElementById('number_of_main_engines').value = APP.state.number_of_main_engines;

        } else {
            speedSlider.max = 45; // Valor padrão se nenhum casco for selecionado
        }
        APP.updateCalculations(); 
    });

    // Event listeners para os novos campos de propulsão
    document.getElementById('fuel_type').addEventListener('change', e => { APP.state.fuel_type = e.target.value; APP.updateCalculations(); });
    document.getElementById('boiler_type').addEventListener('change', e => { APP.state.boiler_type = e.target.value; APP.updateCalculations(); });
    document.getElementById('number_of_boilers').addEventListener('input', e => { 
        let val = parseInt(e.target.value) || 0;
        const hullData = APP.data.hulls[APP.state.hull];
        if (hullData) {
            val = Math.max(hullData.min_boiler_slots, Math.min(val, hullData.max_boiler_slots));
        }
        APP.state.number_of_boilers = val; 
        e.target.value = val; // Atualiza o campo com o valor corrigido
        APP.updateCalculations(); 
    });
    document.getElementById('main_engine_type').addEventListener('change', e => { APP.state.main_engine_type = e.target.value; APP.updateCalculations(); });
    document.getElementById('number_of_main_engines').addEventListener('input', e => { 
        let val = parseInt(e.target.value) || 0;
        const hullData = APP.data.hulls[APP.state.hull];
        if (hullData) {
            val = Math.max(hullData.min_engine_slots, Math.min(val, hullData.max_engine_slots));
        }
        APP.state.number_of_main_engines = val; 
        e.target.value = val; // Atualiza o campo com o valor corrigido
        APP.updateCalculations(); 
    });
    document.getElementById('auxiliary_engine_type').addEventListener('change', e => { APP.state.auxiliary_engine_type = e.target.value; APP.updateCalculations(); });
    document.getElementById('propeller_type').addEventListener('change', e => { APP.state.propeller_type = e.target.value; APP.updateCalculations(); });
    document.getElementById('steering_mechanism_type').addEventListener('change', e => { APP.state.steering_mechanism_type = e.target.value; APP.updateCalculations(); });

    document.getElementById('armor_type').addEventListener('change', e => { APP.state.armor.type = e.target.value; APP.updateCalculations(); });
    document.getElementById('armor_thickness').addEventListener('input', e => { APP.state.armor.thickness = parseInt(e.target.value) || 0; APP.updateCalculations(); });
    
    document.getElementById('displacement_slider').addEventListener('input', e => { APP.state.sliders.displacement = parseInt(e.target.value); APP.updateCalculations(); });
    document.getElementById('speed_slider').addEventListener('input', e => { 
        const hullData = APP.data.hulls[APP.state.hull];
        let newSpeed = parseInt(e.target.value);
        if (hullData && newSpeed > hullData.max_speed) {
            newSpeed = hullData.max_speed; // Limita a velocidade ao máximo do casco
            e.target.value = newSpeed; // Atualiza o slider visualmente
        }
        APP.state.sliders.speed = newSpeed; 
        APP.updateCalculations(); 
    });
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
    if (!select) {
        console.error(`Elemento select com ID '${selectId}' não encontrado.`);
        return;
    }
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
    if (!caliber || !turrets || !barrels || !mark) { APP.showAlert("Preencha todos os campos da torre."); return; }
    APP.state.armaments.push({ id: `gun_${Date.now()}`, type: 'gun_turret', caliber, turrets, barrels, mark });
    APP.updateCalculations();
};

APP.addTorpedo = () => {
    const tubes = parseInt(document.getElementById('torpedo_tubes').value);
    const mark = document.getElementById('torpedo_mark').value;
    if (!tubes || !mark) { APP.showAlert("Preencha todos os campos do lançador."); return; }
    APP.state.armaments.push({ id: `torpedo_${Date.now()}`, type: 'torpedo_launcher', tubes, mark });
    APP.updateCalculations();
};

APP.removeArmament = (armamentId) => {
    APP.state.armaments = APP.state.armaments.filter(arm => arm.id !== armamentId);
    APP.updateCalculations();
};

// =================================================================================
// CÁLCULO PRINCIPAL (BALANCEAMENTO V3)
// =================================================================================

APP.getCalculatedTotals = () => {
    if (!APP.state.hull) { return null; }
    const hullData = APP.data.hulls[APP.state.hull];
    if (!hullData) return null;

    // Obter dados dos componentes de propulsão selecionados
    const fuelData = APP.data.fuels[APP.state.fuel_type];
    const boilerData = APP.data.boilers[APP.state.boiler_type];
    const mainEngineData = APP.data.main_engines[APP.state.main_engine_type];
    const auxiliaryData = APP.data.auxiliaries[APP.state.auxiliary_engine_type];
    const propellerData = APP.data.propellers[APP.state.propeller_type];
    const steeringData = APP.data.steering_mechanism[APP.state.steering_mechanism_type];

    const displacementMultiplier = APP.state.sliders.displacement / 100;
    let modifiedTonnage = hullData.base_tonnage * displacementMultiplier;
    let modifiedCost = hullData.base_cost * Math.pow(displacementMultiplier, 2.0);
    const modifiedSlots = {
        armament: Math.floor((hullData.slots.main_armament + (hullData.slots.secondary_armament || 0)) * displacementMultiplier),
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
        stability: 100, // Estabilidade base
        maneuverability: hullData.base_maneuverability, // Manobrabilidade base do casco
        firepower: 0,
        aa_rating: 0,
        asw_rating: 0,
        finalSpeed: 0,
        finalRange: 0,
        finalReliability: 0,
        finalStability: 0,
        finalAccuracy: 0,
        finalFirepower: 0,
        engineName: 'N/A', // Para exibição na ficha
        fuelName: 'N/A',
        boilerName: 'N/A',
        propellerName: 'N/A',
        steeringName: 'N/A',
        auxiliaryName: 'N/A'
    };

    // Aplicar modificadores de doutrina naval
    if (APP.state.doctrine && APP.data.doctrines[APP.state.doctrine]) {
        const doctrine = APP.data.doctrines[APP.state.doctrine];
        total.cost *= doctrine.cost_modifier || 1.0;
        if (doctrine.performance_bonus) {
            if (doctrine.performance_bonus.all) {
                total.reliability_mod *= doctrine.performance_bonus.all;
                total.accuracy_mod *= doctrine.performance_bonus.all;
                total.stability *= doctrine.performance_bonus.all;
                total.maneuverability *= doctrine.performance_bonus.all;
            }
            if (doctrine.performance_bonus.firepower) total.firepower_mod = (total.firepower_mod || 1.0) * doctrine.performance_bonus.firepower;
            if (doctrine.performance_bonus.armor) total.armor_mod = (total.armor_mod || 1.0) * doctrine.performance_bonus.armor;
            if (doctrine.performance_bonus.asw) total.asw_mod = (total.asw_mod || 1.0) * doctrine.performance_bonus.asw;
            if (doctrine.performance_bonus.aa) total.aa_mod = (total.aa_mod || 1.0) * doctrine.performance_bonus.aa;
            // Velocidade e Alcance são tratados de forma diferente nos sliders
        }
    }


    // CÁLCULOS DE PROPULSÃO
    if (fuelData) {
        total.cost *= fuelData.cost_mod;
        total.tonnage *= fuelData.tonnage_mod;
        total.reliability_mod *= fuelData.reliability_mod;
        total.fuelName = fuelData.name;
    }
    
    if (boilerData && APP.state.number_of_boilers > 0) {
        const numBoilers = APP.state.number_of_boilers;
        total.cost += boilerData.cost_per_unit * numBoilers;
        total.tonnage += boilerData.tonnage_per_unit * numBoilers;
        total.power_gen += boilerData.power_per_unit * numBoilers;
        total.reliability_mod *= boilerData.reliability_mod;
        total.boilerName = `${numBoilers}x ${boilerData.name}`;
    }

    if (mainEngineData && APP.state.number_of_main_engines > 0) {
        const numEngines = APP.state.number_of_main_engines;
        total.cost += mainEngineData.cost_per_unit * numEngines;
        total.tonnage += mainEngineData.tonnage_per_unit * numEngines;
        total.power_gen += mainEngineData.base_power_per_unit * numEngines;
        total.stability += mainEngineData.stability_mod_per_unit * numEngines;
        total.maneuverability += mainEngineData.maneuverability_mod_per_unit * numEngines;
        total.engineName = `${numEngines}x ${mainEngineData.name}`;
    }

    if (auxiliaryData && auxiliaryData.name !== "Nenhum") {
        total.cost += auxiliaryData.cost;
        total.tonnage += auxiliaryData.tonnage;
        total.power_gen += auxiliaryData.power_add;
        total.reliability_mod *= auxiliaryData.reliability_mod;
        total.maneuverability *= auxiliaryData.maneuverability_mod;
        total.slots_utility.used += auxiliaryData.slots_required;
        total.auxiliaryName = auxiliaryData.name;
    }

    if (propellerData) {
        total.cost *= propellerData.cost_mod;
        total.tonnage *= propellerData.tonnage_mod;
        total.stability += propellerData.stability_mod;
        total.maneuverability *= propellerData.maneuverability_mod;
        total.power_gen *= propellerData.efficiency; // Eficiência das hélices na geração de potência utilizável
        total.propellerName = propellerData.name;
    }

    if (steeringData) {
        total.cost += steeringData.cost;
        total.tonnage += steeringData.tonnage;
        total.reliability_mod *= steeringData.reliability_mod;
        total.stability += steeringData.stability_mod;
        total.maneuverability *= steeringData.maneuverability_mod;
        total.steeringName = steeringData.name;
    }

    // Impacto do combustível na potência total
    if (fuelData) {
        total.power_gen *= fuelData.power_mod;
    }

    // Cálculo da Velocidade Final
    const targetSpeed = APP.state.sliders.speed;
    const maxSpeedHull = hullData.max_speed;
    const effectiveTargetSpeed = Math.min(targetSpeed, maxSpeedHull); // A velocidade alvo não pode exceder o máximo do casco

    // Fórmula simplificada para potência necessária (aproximação do cubo da velocidade)
    // Coeficiente de arrasto base: Quanto maior o deslocamento, mais potência para a mesma velocidade.
    const dragCoefficient = total.tonnage / 1000; 
    const requiredPower = dragCoefficient * Math.pow(effectiveTargetSpeed, 3) * 0.001; // Ajuste o 0.001 para balanceamento

    if (total.power_gen >= requiredPower && effectiveTargetSpeed > 0) {
        total.finalSpeed = effectiveTargetSpeed;
    } else if (total.power_gen > 0) {
        // Calcula a velocidade máxima atingível com a potência gerada
        total.finalSpeed = Math.min(maxSpeedHull, Math.pow(total.power_gen / dragCoefficient / 0.001, 1/3));
    } else {
        total.finalSpeed = 0;
    }

    // Cálculo do Alcance Final
    // Assumimos um consumo de combustível base por km por tonelada
    const baseFuelConsumptionPerKmPerTon = 0.00005; // Ajuste este valor
    // O alcance desejado do slider é o que o jogador quer. O custo e tonelagem se ajustam a isso.
    // A lógica anterior de adicionar tonelagem de alcance diretamente ao total de tonelagem está sendo removida
    // e substituída por um custo de combustível proporcional ao alcance desejado.

    // Custo e tonelagem do combustível para o alcance desejado
    const desiredRange = APP.state.sliders.range;
    const fuelTonnageForRange = (desiredRange * baseFuelConsumptionPerKmPerTon * total.tonnage) / (fuelData ? fuelData.range_factor : 1.0);
    const fuelCostForRange = fuelTonnageForRange * 500; // Custo por tonelada de combustível

    total.tonnage += fuelTonnageForRange;
    total.cost += fuelCostForRange;
    total.finalRange = desiredRange; // O alcance é o que o jogador escolhe, mas tem um custo e peso

    // Penalidade de manobrabilidade por tonelagem excessiva ou navio muito grande
    total.maneuverability -= (total.tonnage / 1000) * 0.5; // Ajuste o 0.5 para balanceamento
    total.maneuverability = Math.max(0, Math.min(100, total.maneuverability)); // Limita entre 0 e 100

    // CÁLCULOS EXISTENTES (mantidos e ajustados)
    if (APP.state.armor.type !== 'none' && APP.state.armor.thickness > 0) {
        const armorData = APP.data.armor[APP.state.armor.type];
        const surfaceAreaProxy = Math.pow(modifiedTonnage, 0.667);
        const armorTonnage = armorData.tonnage_per_mm_ton * APP.state.armor.thickness * (surfaceAreaProxy / 150);
        total.cost += armorData.cost_per_mm_ton * APP.state.armor.thickness * (surfaceAreaProxy / 150);
        total.tonnage += armorTonnage;
        total.stability -= (armorTonnage / 1000); // Penalidade de estabilidade pela blindagem
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
                if (compData.maneuverability_mod) total.maneuverability *= compData.maneuverability_mod;
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
            total.firepower += base.firepower_per_mm * arm.caliber * totalGuns;
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

    // Finalizar cálculos de estatísticas
    total.finalReliability = Math.min(100, Math.max(0, 100 * total.reliability_mod));
    total.finalStability = Math.max(0, Math.min(100, Math.round(total.stability)));
    total.finalAccuracy = Math.round(100 * total.accuracy_mod * (total.finalStability / 100)); // Estabilidade afeta precisão
    total.finalFirepower = Math.round(total.firepower * (total.firepower_mod || 1.0));
    total.finalManeuverability = Math.max(0, Math.min(100, Math.round(total.maneuverability))); // Limita manobrabilidade

    total.maxTonnage = hullData.base_tonnage * (APP.state.sliders.displacement / 100) * 1.5; // Margem de excesso de peso

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
    document.getElementById('speed_value_label').textContent = `${APP.state.sliders.speed} nós`; // Velocidade alvo
    document.getElementById('range_value_label').textContent = `${APP.state.sliders.range.toLocaleString('pt-BR')} km`;

    document.getElementById('display_name').textContent = APP.state.shipName || "Novo Projeto";
    document.getElementById('display_class').textContent = hullData.name;
    document.getElementById('display_cost').textContent = `£${Math.round(totals.cost).toLocaleString('pt-BR')}`;
    document.getElementById('display_speed').textContent = `${totals.finalSpeed.toFixed(1)} nós`; // Velocidade real
    document.getElementById('display_reliability').textContent = `${Math.round(totals.finalReliability)}%`;
    document.getElementById('display_stability').textContent = `${totals.finalStability}%`;
    document.getElementById('display_accuracy').textContent = `${totals.finalAccuracy}%`;
    document.getElementById('display_maneuverability').textContent = `${totals.finalManeuverability}%`; // Nova estatística

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
    if (totals.finalManeuverability < 30) warnings.push("Manobrabilidade muito baixa!");
    if (totals.finalSpeed < APP.state.sliders.speed * 0.95) warnings.push(`Motor fraco para a velocidade alvo! Velocidade real: ${totals.finalSpeed.toFixed(1)} nós.`);
    if (APP.state.number_of_boilers < hullData.min_boiler_slots || APP.state.number_of_boilers > hullData.max_boiler_slots) {
        warnings.push(`Número de caldeiras (${APP.state.number_of_boilers}) fora do limite do casco (${hullData.min_boiler_slots}-${hullData.max_boiler_slots}).`);
    }
    if (APP.state.number_of_main_engines < hullData.min_engine_slots || APP.state.number_of_main_engines > hullData.max_engine_slots) {
        warnings.push(`Número de motores (${APP.state.number_of_main_engines}) fora do limite do casco (${hullData.min_engine_slots}-${hullData.max_engine_slots}).`);
    }


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

APP.showAlert = (message) => {
    const statusPanel = document.getElementById('status_panel');
    statusPanel.className = 'status-indicator status-error';
    statusPanel.textContent = message;
    setTimeout(() => {
        APP.updateCalculations(); // Restaura o status normal após um tempo
    }, 3000);
};

// =================================================================================
// GERENCIAMENTO DE PROJETO
// =================================================================================

APP.saveAndShowSheet = () => {
    if (!APP.state.hull) {
        APP.showAlert("Selecione um casco antes de finalizar o projeto.");
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
            // Incluir os novos dados de propulsão para a ficha
            fuels: APP.data.fuels,
            boilers: APP.data.boilers,
            main_engines: APP.data.main_engines,
            auxiliaries: APP.data.auxiliaries,
            propellers: APP.data.propellers,
            steering_mechanism: APP.data.steering_mechanism
        }
    };
    
    localStorage.setItem('shipSheetData', JSON.stringify(finalData));
    window.open('ship_sheet.html', '_blank');
};

APP.exportDesign = () => {
    const jsonString = JSON.stringify(APP.state, null, 2);
    // Usar document.execCommand('copy') como fallback para navigator.clipboard.writeText()
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(jsonString).then(() => {
            APP.showAlert("Código do projeto copiado para a área de transferência!");
        }).catch(err => {
            console.error('Erro ao copiar texto com navigator.clipboard: ', err);
            APP.fallbackCopyTextToClipboard(jsonString);
        });
    } else {
        APP.fallbackCopyTextToClipboard(jsonString);
    }
};

APP.fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Evita rolagem para o final da página
    textArea.style.left = "-9999px";
    textArea.style.top = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'bem-sucedida' : 'mal-sucedida';
        APP.showAlert(`Cópia ${msg} para a área de transferência!`);
    } catch (err) {
        console.error('Erro ao copiar texto com execCommand: ', err);
        prompt("Não foi possível copiar automaticamente. Copie este código:", text);
    }
    document.body.removeChild(textArea);
};


APP.importDesign = () => {
    const jsonString = prompt("Cole o código do projeto aqui:");
    if (jsonString) {
        try {
            const newState = JSON.parse(jsonString);
            APP.loadState(newState);
            APP.showAlert("Projeto importado com sucesso!");
        } catch (error) {
            APP.showAlert("Erro ao ler o código do projeto. Formato inválido.");
            console.error("Erro de importação:", error);
        }
    }
};

APP.loadState = (newState) => {
    // Mescla o estado importado com o estado padrão para garantir que novas propriedades sejam inicializadas
    APP.state = {
        ...{ 
            shipName: "Novo Projeto Importado",
            country: null, doctrine: null, hull: null,
            fuel_type: null, boiler_type: null, number_of_boilers: 1,
            main_engine_type: null, number_of_main_engines: 1,
            auxiliary_engine_type: 'none', propeller_type: null, steering_mechanism_type: null,
            sliders: { displacement: 100, speed: 25, range: 8000 },
            armor: { type: 'none', thickness: 0 },
            armaments: [],
            components: {}
        }, 
        ...newState
    };
    
    // Atualiza os elementos da UI com os valores do estado carregado
    document.getElementById('ship_name').value = APP.state.shipName;
    document.getElementById('country').value = APP.state.country;
    document.getElementById('naval_doctrine').value = APP.state.doctrine;
    document.getElementById('hull_type').value = APP.state.hull;
    
    // Novos campos de propulsão
    document.getElementById('fuel_type').value = APP.state.fuel_type;
    document.getElementById('boiler_type').value = APP.state.boiler_type;
    document.getElementById('number_of_boilers').value = APP.state.number_of_boilers;
    document.getElementById('main_engine_type').value = APP.state.main_engine_type;
    document.getElementById('number_of_main_engines').value = APP.state.number_of_main_engines;
    document.getElementById('auxiliary_engine_type').value = APP.state.auxiliary_engine_type;
    document.getElementById('propeller_type').value = APP.state.propeller_type;
    document.getElementById('steering_mechanism_type').value = APP.state.steering_mechanism_type;

    document.getElementById('armor_type').value = APP.state.armor.type;
    document.getElementById('armor_thickness').value = APP.state.armor.thickness;
    
    document.getElementById('displacement_slider').value = APP.state.sliders.displacement;
    document.getElementById('speed_slider').value = APP.state.sliders.speed;
    document.getElementById('range_slider').value = APP.state.sliders.range;
    
    // Atualiza os seletores de componentes
    for (const categoryKey in APP.data.components) {
        for (const compKey in APP.data.components[categoryKey].options) {
             const select = document.getElementById(`comp_${compKey}`);
             if(select) {
                 select.value = APP.state.components[compKey] || Object.keys(APP.data.components[categoryKey].options[compKey].options)[0];
             }
        }
    }

    // Recria a lista de armamentos
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
    
    // Dispara o evento de mudança do casco para recalcular limites e atualizar UI
    const hullSelect = document.getElementById('hull_type');
    if (hullSelect) {
        // Simula uma mudança para recalcular os limites do slider de velocidade e outros
        const event = new Event('change');
        hullSelect.dispatchEvent(event);
    } else {
        APP.updateCalculations(); // Se o casco não foi encontrado (erro), apenas recalcula
    }
};


document.addEventListener('DOMContentLoaded', APP.init);
