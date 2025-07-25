// =================================================================================
// CONSTRUTOR NAVAL AVANÇADO - LÓGICA PRINCIPAL
// =================================================================================

const APP = {
    data: {},
    state: {
        shipName: "Novo Projeto",
        country: null,
        doctrine: null,
        hull: null,
        sliders: {
            displacement: 100,
            speed: 25,
            range: 8000
        },
        armor: { type: 'none', thickness: 0 },
        armaments: [],
        components: {} // Para armazenar seleções de componentes como radar, sonar etc.
    },
    dataUrls: {
        hulls: 'data/hulls.json',
        engines: 'data/engines.json',
        armaments: 'data/armaments.json',
        armor: 'data/armor.json',
        components: 'data/components.json',
        doctrines: 'data/doctrines.json',
        countries: 'data/countries.json'
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
    await APP.loadAllData();
    APP.setupUi();
    APP.updateCalculations();
    console.log("Construtor Naval Pronto.", APP.data);
};

APP.loadAllData = async () => {
    try {
        const dataPromises = Object.entries(APP.dataUrls).map(async ([key, url]) => {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Falha ao carregar ${url}`);
            APP.data[key] = await response.json();
        });
        await Promise.all(dataPromises);
        await APP.loadSheetData();
    } catch (error) {
        console.error("Erro fatal durante o carregamento de dados:", error);
        document.getElementById('status_panel').textContent = "Erro crítico ao carregar dados. Recarregue a página.";
    }
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
    // Inputs e Selects principais
    document.getElementById('ship_name').addEventListener('input', e => { APP.state.shipName = e.target.value; APP.updateCalculations(); });
    document.getElementById('country').addEventListener('change', e => { APP.state.country = e.target.value; APP.updateCalculations(); });
    document.getElementById('naval_doctrine').addEventListener('change', e => { APP.state.doctrine = e.target.value; APP.updateCalculations(); });
    document.getElementById('hull_type').addEventListener('change', e => { APP.state.hull = e.target.value; APP.updateCalculations(); });
    document.getElementById('armor_type').addEventListener('change', e => { APP.state.armor.type = e.target.value; APP.updateCalculations(); });
    document.getElementById('armor_thickness').addEventListener('input', e => { APP.state.armor.thickness = parseInt(e.target.value) || 0; APP.updateCalculations(); });
    
    // Sliders
    document.getElementById('displacement_slider').addEventListener('input', e => { APP.state.sliders.displacement = parseInt(e.target.value); APP.updateCalculations(); });
    document.getElementById('speed_slider').addEventListener('input', e => { APP.state.sliders.speed = parseInt(e.target.value); APP.updateCalculations(); });
    document.getElementById('range_slider').addEventListener('input', e => { APP.state.sliders.range = parseInt(e.target.value); APP.updateCalculations(); });

    // Botões de Ação
    document.getElementById('add_gun_button').addEventListener('click', APP.addGun);
    document.getElementById('add_torpedo_button').addEventListener('click', APP.addTorpedo);
    document.getElementById('save_design_button').addEventListener('click', APP.saveAndShowSheet);
    document.getElementById('export_design_button').addEventListener('click', APP.exportDesign);
    document.getElementById('import_design_button').addEventListener('click', APP.importDesign);
    
    // Componentes
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
    const modifiedCost = hullData.base_cost * (1 + (displacementMultiplier - 1) * 1.5);
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
        firepower: 0,
        aa_rating: 0,
        asw_rating: 0
    };

    const targetSpeed = APP.state.sliders.speed;
    const requiredPower = (total.tonnage / 1000) * Math.pow(targetSpeed / 8, 2);
    
    let bestEngine = Object.values(APP.data.engines).filter(e => e.power_generation >= requiredPower).sort((a,b) => a.cost - b.cost)[0];
    if (!bestEngine) {
        bestEngine = Object.values(APP.data.engines).reduce((a, b) => a.power_generation > b.power_generation ? a : b);
    }
    
    if (bestEngine) {
        total.cost += bestEngine.cost;
        total.tonnage += bestEngine.tonnage;
        total.power_gen += bestEngine.power_generation;
        total.slots_utility.used += bestEngine.slots_required;
        total.engineName = bestEngine.name;
    }

    const rangeTonnage = (APP.state.sliders.range / 1000) * (hullData.displacement_mod || 1);
    total.tonnage += rangeTonnage;
    total.cost += rangeTonnage * 50;

    if (APP.state.armor.type !== 'none' && APP.state.armor.thickness > 0) {
        const armorData = APP.data.armor[APP.state.armor.type];
        const armorTonnage = armorData.tonnage_per_mm_ton * APP.state.armor.thickness * (modifiedTonnage / 1000);
        total.cost += armorData.cost_per_mm_ton * APP.state.armor.thickness * (modifiedTonnage / 1000);
        total.tonnage += armorTonnage;
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
                if (compData.firepower_mod) total.firepower += total.firepower * (compData.firepower_mod - 1);
            }
        }
    }

    APP.state.armaments.forEach(arm => {
        if (arm.type === 'gun_turret') {
            const markData = APP.data.armaments.gun_marks[arm.mark];
            const base = APP.data.armaments.base_values.gun;
            const totalGuns = arm.turrets * arm.barrels;
            total.cost += base.cost_per_mm * arm.caliber * totalGuns * markData.cost_mod;
            total.tonnage += base.tonnage_per_mm * arm.caliber * totalGuns * markData.tonnage_mod;
            total.power_draw += base.power_draw_per_mm * arm.caliber * totalGuns * markData.power_mod;
            total.slots_armament.used += base.slots_per_turret * arm.turrets * markData.slots_mod;
            total.firepower += base.firepower_per_mm * arm.caliber * totalGuns * markData.accuracy_mod;
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
    total.finalSpeed = APP.state.sliders.speed * Math.min(1, total.power_gen / requiredPower);
    total.maxTonnage = hullData.base_tonnage * (APP.state.sliders.displacement / 100) * 1.25;

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
    document.getElementById('display_reliability').textContent = `${Math.round(totals.finalReliability)}%`;

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
            armor: APP.data.armor
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
    // Garante que o estado importado tenha todas as chaves necessárias
    APP.state = {
        ...{ // Default state structure
            shipName: "Novo Projeto Importado",
            country: null, doctrine: null, hull: null,
            sliders: { displacement: 100, speed: 25, range: 8000 },
            armor: { type: 'none', thickness: 0 },
            armaments: [],
            components: {}
        }, 
        ...newState
    };
    
    // Atualiza os valores dos inputs e selects da UI para refletir o novo estado
    document.getElementById('ship_name').value = APP.state.shipName;
    document.getElementById('country').value = APP.state.country;
    document.getElementById('naval_doctrine').value = APP.state.doctrine;
    document.getElementById('hull_type').value = APP.state.hull;
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
