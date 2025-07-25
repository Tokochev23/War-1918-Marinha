// =================================================================================
// CONSTRUTOR NAVAL AVANÇADO - LÓGICA PRINCIPAL (BALANCEAMENTO V3)
// =================================================================================

const APP = {
    // Dados de configuração para cascos, motores, armamentos, blindagens e componentes
    data: {
        hulls: {
            "submarine": { "name": "Submarino", "base_cost": 35550, "base_tonnage": 600, "base_speed": 15, "displacement_mod": 0.5, "base_stability": 70, "max_displacement_cap": 5000, "slots": { "main_armament": 1, "secondary_armament": 2, "torpedo": 4, "asw": 0, "utility": 4, "engine": 1, "armor_belt": 0, "armor_deck": 0, "armor_bow_stern": 0, "armor_conning": 0, "armor_superstructure": 0, "armor_barbettes": 0 } },
            "destroyer": { "name": "Contratorpedeiro", "base_cost": 59250, "base_tonnage": 1500, "base_speed": 35, "displacement_mod": 1.0, "base_stability": 80, "max_displacement_cap": 10000, "slots": { "main_armament": 2, "secondary_armament": 4, "torpedo": 2, "asw": 2, "utility": 6, "engine": 2, "armor_belt": 1, "armor_deck": 1, "armor_bow_stern": 1, "armor_conning": 1, "armor_superstructure": 1, "armor_barbettes": 1 } },
            "light_cruiser": { "name": "Cruzador Leve", "base_cost": 118500, "base_tonnage": 4000, "base_speed": 32, "displacement_mod": 1.2, "base_stability": 75, "max_displacement_cap": 25000, "slots": { "main_armament": 3, "secondary_armament": 6, "torpedo": 2, "asw": 1, "utility": 8, "engine": 3, "armor_belt": 1, "armor_deck": 1, "armor_bow_stern": 1, "armor_conning": 1, "armor_superstructure": 1, "armor_barbettes": 1 } },
            "heavy_cruiser": { "name": "Cruzador Pesado", "base_cost": 177750, "base_tonnage": 8000, "base_speed": 30, "displacement_mod": 1.5, "base_stability": 70, "max_displacement_cap": 40000, "slots": { "main_armament": 4, "secondary_armament": 8, "torpedo": 0, "asw": 0, "utility": 10, "engine": 4, "armor_belt": 1, "armor_deck": 1, "armor_bow_stern": 1, "armor_conning": 1, "armor_superstructure": 1, "armor_barbettes": 1 } },
            "battlecruiser": { "name": "Cruzador de Batalha", "base_cost": 296250, "base_tonnage": 18000, "base_speed": 28, "displacement_mod": 1.8, "base_stability": 65, "max_displacement_cap": 70000, "slots": { "main_armament": 4, "secondary_armament": 10, "torpedo": 0, "asw": 0, "utility": 12, "engine": 5, "armor_belt": 1, "armor_deck": 1, "armor_bow_stern": 1, "armor_conning": 1, "armor_superstructure": 1, "armor_barbettes": 1 } },
            "battleship": { "name": "Encouraçado", "base_cost": 444375, "base_tonnage": 30000, "base_speed": 25, "displacement_mod": 2.0, "base_stability": 60, "max_displacement_cap": 115000, "slots": { "main_armament": 5, "secondary_armament": 12, "torpedo": 0, "asw": 0, "utility": 15, "engine": 6, "armor_belt": 1, "armor_deck": 1, "armor_bow_stern": 1, "armor_conning": 1, "armor_superstructure": 1, "armor_barbettes": 1 } }
        },
        // Tipos de motor com suas características e modificadores
        engines: {
            "steam_turbines": { "name": "Turbinas a Vapor", "hp_per_ton": 15, "fuel_efficiency": 0.8, "cost_multiplier": 1.0, "precision_modifier": -0.05, "stability_modifier": 0.02, "power_output_per_unit": 1000 },
            "turbo_electric": { "name": "Turboelétrico", "hp_per_ton": 12, "fuel_efficiency": 1.2, "cost_multiplier": 1.5, "precision_modifier": 0.05, "stability_modifier": 0.03, "power_output_per_unit": 800 },
            "diesel": { "name": "Diesel", "hp_per_ton": 10, "fuel_efficiency": 1.5, "cost_multiplier": 0.8, "precision_modifier": -0.02, "stability_modifier": 0.01, "power_output_per_unit": 700 },
            "gas_turbines": { "name": "Turbinas a Gás", "hp_per_ton": 20, "fuel_efficiency": 0.6, "cost_multiplier": 2.0, "precision_modifier": -0.08, "stability_modifier": 0.01, "power_output_per_unit": 1200 }
        },
        // Tipos de blindagem com seus modificadores de eficácia e fator de peso superior
        armor_types: {
            "none": { "name": "Nenhuma", "type_multiplier": 0, "cost_per_ton": 0, "vertical_factor": 0 },
            "mild_steel": { "name": "Aço Doce", "type_multiplier": 0.8, "cost_per_ton": 50, "vertical_factor": 0.5 },
            "h_steel": { "name": "Aço de Alta Resistência", "type_multiplier": 1.0, "cost_per_ton": 75, "vertical_factor": 0.6 },
            "krupp": { "name": "Krupp", "type_multiplier": 1.5, "cost_per_ton": 120, "vertical_factor": 0.7 }
        },
        // Dados de componentes por categoria
        components: {
            armament: {
                name: "Armamento",
                options: {
                    main_armament: {
                        name: "Armamento Principal",
                        type: "armament",
                        options: {
                            "12in_gun": { "name": "Canhão de 12 polegadas", "weight": 500, "cost": 15000, "power_consumption": 10, "space_required": 5, "precision_modifier": 0.0, "reload_modifier": 0.0, "vertical_factor": 0.8 },
                            "14in_gun": { "name": "Canhão de 14 polegadas", "weight": 750, "cost": 25000, "power_consumption": 15, "space_required": 7, "precision_modifier": -0.02, "reload_modifier": -0.05, "vertical_factor": 0.9 },
                            "16in_gun": { "name": "Canhão de 16 polegadas", "weight": 1000, "cost": 40000, "power_consumption": 20, "space_required": 10, "precision_modifier": -0.05, "reload_modifier": -0.10, "vertical_factor": 1.0 },
                            "18in_gun": { "name": "Canhão de 18 polegadas", "weight": 1500, "cost": 60000, "power_consumption": 30, "space_required": 15, "precision_modifier": -0.08, "reload_modifier": -0.15, "vertical_factor": 1.1 },
                            "20in_gun": { "name": "Canhão de 20 polegadas", "weight": 2000, "cost": 90000, "power_consumption": 40, "space_required": 20, "precision_modifier": -0.12, "reload_modifier": -0.20, "vertical_factor": 1.2 }
                        }
                    },
                    secondary_armament: {
                        name: "Armamento Secundário",
                        type: "armament",
                        options: {
                            "4in_gun": { "name": "Canhão de 4 polegadas", "weight": 50, "cost": 2000, "power_consumption": 2, "space_required": 1, "precision_modifier": 0.0, "reload_modifier": 0.0, "vertical_factor": 0.6 },
                            "6in_gun": { "name": "Canhão de 6 polegadas", "weight": 100, "cost": 4000, "power_consumption": 4, "space_required": 2, "precision_modifier": -0.01, "reload_modifier": -0.02, "vertical_factor": 0.7 },
                            "8in_gun": { "name": "Canhão de 8 polegadas", "weight": 150, "cost": 6000, "power_consumption": 6, "space_required": 3, "precision_modifier": -0.02, "reload_modifier": -0.04, "vertical_factor": 0.8 }
                        }
                    },
                    torpedo: {
                        name: "Tubos de Torpedo",
                        type: "armament",
                        options: {
                            "none": { "name": "Nenhum", "weight": 0, "cost": 0, "power_consumption": 0, "space_required": 0, "precision_modifier": 0, "reload_modifier": 0, "vertical_factor": 0 },
                            "single_tube": { "name": "Tubo Simples", "weight": 10, "cost": 5000, "power_consumption": 1, "space_required": 1, "precision_modifier": 0, "reload_modifier": 0, "vertical_factor": 0.5 },
                            "twin_tube": { "name": "Tubo Duplo", "weight": 20, "cost": 9000, "power_consumption": 2, "space_required": 2, "precision_modifier": 0, "reload_modifier": 0, "vertical_factor": 0.5 }
                        }
                    },
                    asw: {
                        name: "Armamento Anti-Submarino (ASW)",
                        type: "armament",
                        options: {
                            "none": { "name": "Nenhum", "weight": 0, "cost": 0, "power_consumption": 0, "space_required": 0, "precision_modifier": 0, "reload_modifier": 0, "vertical_factor": 0 },
                            "depth_charges": { "name": "Cargas de Profundidade", "weight": 15, "cost": 3000, "power_consumption": 1, "space_required": 1, "precision_modifier": 0, "reload_modifier": 0, "vertical_factor": 0.4 },
                            "mortar_asw": { "name": "Morteiro ASW", "weight": 25, "cost": 6000, "power_consumption": 2, "space_required": 2, "precision_modifier": 0, "reload_modifier": 0, "vertical_factor": 0.5 }
                        }
                    }
                }
            },
            // Novas categorias de componentes
            control_systems: {
                name: "Sistemas de Controle de Tiro",
                options: {
                    fire_control: {
                        name: "Sistema de Controle de Tiro",
                        type: "control_system",
                        options: {
                            "basic_fcs": { "name": "FCS Básico", "weight": 50, "cost": 10000, "power_consumption": 5, "space_required": 2, "precision_modifier": 0.05, "stability_modifier": 0.0, "range_modifier": 0.0 },
                            "advanced_fcs": { "name": "FCS Avançado", "weight": 100, "cost": 25000, "power_consumption": 10, "space_required": 4, "precision_modifier": 0.15, "stability_modifier": -0.01, "range_modifier": 0.05 },
                            "radar_fcs": { "name": "FCS com Radar", "weight": 150, "cost": 50000, "power_consumption": 20, "space_required": 6, "precision_modifier": 0.25, "stability_modifier": -0.02, "range_modifier": 0.10 }
                        }
                    }
                }
            },
            torpedo_protection: {
                name: "Proteção Anti-Torpedos",
                options: {
                    torpedo_bulkhead: {
                        name: "Antepara Anti-Torpedos",
                        type: "torpedo_protection",
                        options: {
                            "none": { "name": "Nenhuma", "weight": 0, "cost": 0, "power_consumption": 0, "space_required": 0, "maneuverability_penalty": 0 },
                            "single_bulkhead": { "name": "Antepara Simples", "weight": 200, "cost": 10000, "power_consumption": 0, "space_required": 5, "maneuverability_penalty": 0.02 },
                            "double_bulkhead": { "name": "Antepara Dupla", "weight": 400, "cost": 25000, "power_consumption": 0, "space_required": 10, "maneuverability_penalty": 0.05 }
                        }
                    }
                }
            },
            auxiliary_systems: {
                name: "Sistemas Auxiliares",
                options: {
                    fuel_tanks: {
                        name: "Tanques de Combustível",
                        type: "auxiliary_system",
                        options: {
                            "small_tank": { "name": "Pequeno", "weight": 50, "cost": 2000, "power_consumption": 0, "space_required": 5, "fuel_capacity": 500 },
                            "medium_tank": { "name": "Médio", "weight": 100, "cost": 4000, "power_consumption": 0, "space_required": 10, "fuel_capacity": 1000 },
                            "large_tank": { "name": "Grande", "weight": 200, "cost": 8000, "power_consumption": 0, "space_required": 20, "fuel_capacity": 2000 }
                        }
                    }
                }
            },
            ammunition_types: {
                name: "Munição e Propelente",
                options: {
                    shell_type: {
                        name: "Tipo de Projétil Principal",
                        type: "ammunition",
                        options: {
                            "ap": { "name": "AP (Perf. Blindagem)", "cost_multiplier": 1.2, "damage_modifier": 1.0, "penetration_modifier": 1.2 },
                            "he": { "name": "HE (Altamente Explosivo)", "cost_multiplier": 1.0, "damage_modifier": 1.5, "penetration_modifier": 0.8 }
                        }
                    },
                    propellant_type: {
                        name: "Tipo de Propelente",
                        type: "propellant",
                        options: {
                            "cordite": { "name": "Cordite", "cost_multiplier": 1.0, "precision_modifier": 0.0, "safety_modifier": 1.0 },
                            "tube_powder": { "name": "Pó Tubular", "cost_multiplier": 0.9, "precision_modifier": -0.02, "safety_modifier": 1.1 },
                            "tnt": { "name": "TNT", "cost_multiplier": 1.1, "precision_modifier": 0.01, "safety_modifier": 0.9 }
                        }
                    }
                }
            }
        },
    },
    // Estado atual do projeto do navio
    state: {
        shipName: "Novo Navio",
        country: "N/A",
        doctrine: "N/A",
        hull: null,
        engine_type: null,
        armor: {
            type: 'none',
            belt_thickness: 0,
            deck_thickness: 0,
            bow_stern_thickness: 0,
            conning_thickness: 0,
            superstructure_thickness: 0,
            barbettes_thickness: 0
        },
        sliders: {
            displacement: 0, // Agora calculado, não diretamente ajustado por slider
            speed: 0,
            range: 0
        },
        armaments: {
            main_armament: null,
            secondary_armament: null,
            torpedo: null,
            asw: null
        },
        components: { // Para os novos módulos
            fire_control: null,
            torpedo_bulkhead: null,
            fuel_tanks: null,
            shell_type: null,
            propellant_type: null
        },
        calculated: { // Estatísticas calculadas
            totalWeight: 0,
            totalCost: 0,
            totalPowerOutput: 0,
            totalFuelCapacity: 0,
            finalSpeed: 0,
            finalRange: 0,
            totalPrecisionModifier: 0,
            totalStability: 0,
            statusMessage: "Selecione um tipo de casco para começar.",
            statusType: "info"
        }
    },
    // Inicialização da aplicação
    init: function() {
        APP.loadState(); // Tenta carregar o estado salvo
        APP.populateDropdowns();
        APP.attachEventListeners();
        APP.updateUI(); // Atualiza a UI com o estado inicial/carregado
    },

    // Popula os dropdowns com as opções de dados
    populateDropdowns: function() {
        // Popula tipos de casco
        const hullSelect = document.getElementById('hull_type');
        for (const key in APP.data.hulls) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = APP.data.hulls[key].name;
            hullSelect.appendChild(option);
        }

        // Popula tipos de motor
        const engineTypeSelect = document.getElementById('engine_type');
        for (const key in APP.data.engines) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = APP.data.engines[key].name;
            engineTypeSelect.appendChild(option);
        }

        // Popula tipos de blindagem
        const armorTypeSelect = document.getElementById('armor_type');
        for (const key in APP.data.armor_types) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = APP.data.armor_types[key].name;
            armorTypeSelect.appendChild(option);
        }

        // Popula armamentos e novos componentes
        for (const categoryKey in APP.data.components) {
            const category = APP.data.components[categoryKey];
            for (const compKey in category.options) {
                const select = document.getElementById(`comp_${compKey}`);
                if (select) {
                    for (const optionKey in category.options[compKey].options) {
                        const option = document.createElement('option');
                        option.value = optionKey;
                        option.textContent = category.options[compKey].options[optionKey].name;
                        select.appendChild(option);
                    }
                }
            }
        }
    },

    // Anexa listeners de eventos a todos os elementos interativos
    attachEventListeners: function() {
        document.getElementById('ship_name').addEventListener('input', (e) => { APP.state.shipName = e.target.value; APP.updateUI(); });
        document.getElementById('country').addEventListener('input', (e) => { APP.state.country = e.target.value; APP.updateUI(); });
        document.getElementById('naval_doctrine').addEventListener('input', (e) => { APP.state.doctrine = e.target.value; APP.updateUI(); });

        document.getElementById('hull_type').addEventListener('change', (e) => {
            APP.state.hull = e.target.value;
            // Resetar sliders e componentes ao mudar o casco para evitar estados inválidos
            APP.state.sliders.speed = 0;
            APP.state.sliders.range = 0;
            APP.state.engine_type = null;
            APP.state.armor.type = 'none';
            APP.state.armor.belt_thickness = 0;
            APP.state.armor.deck_thickness = 0;
            APP.state.armor.bow_stern_thickness = 0;
            APP.state.armor.conning_thickness = 0;
            APP.state.armor.superstructure_thickness = 0;
            APP.state.armor.barbettes_thickness = 0;

            for (const arm in APP.state.armaments) {
                APP.state.armaments[arm] = null;
            }
            for (const comp in APP.state.components) {
                APP.state.components[comp] = null;
            }

            APP.updateUI();
        });

        document.getElementById('engine_type').addEventListener('change', (e) => { APP.state.engine_type = e.target.value; APP.updateUI(); });
        document.getElementById('armor_type').addEventListener('change', (e) => { APP.state.armor.type = e.target.value; APP.updateUI(); });

        // Sliders de blindagem
        document.getElementById('armor_belt_thickness').addEventListener('input', (e) => { APP.state.armor.belt_thickness = parseFloat(e.target.value); APP.updateUI(); });
        document.getElementById('armor_deck_thickness').addEventListener('input', (e) => { APP.state.armor.deck_thickness = parseFloat(e.target.value); APP.updateUI(); });
        document.getElementById('armor_bow_stern_thickness').addEventListener('input', (e) => { APP.state.armor.bow_stern_thickness = parseFloat(e.target.value); APP.updateUI(); });
        document.getElementById('armor_conning_thickness').addEventListener('input', (e) => { APP.state.armor.conning_thickness = parseFloat(e.target.value); APP.updateUI(); });
        document.getElementById('armor_superstructure_thickness').addEventListener('input', (e) => { APP.state.armor.superstructure_thickness = parseFloat(e.target.value); APP.updateUI(); });
        document.getElementById('armor_barbettes_thickness').addEventListener('input', (e) => { APP.state.armor.barbettes_thickness = parseFloat(e.target.value); APP.updateUI(); });


        // Sliders de estatísticas (agora controlam potência/capacidade, não o valor final diretamente)
        document.getElementById('speed_slider').addEventListener('input', (e) => { APP.state.sliders.speed = parseFloat(e.target.value); APP.updateUI(); });
        document.getElementById('range_slider').addEventListener('input', (e) => { APP.state.sliders.range = parseFloat(e.target.value); APP.updateUI(); });

        // Componentes de armamento
        document.getElementById('comp_main_armament').addEventListener('change', (e) => { APP.state.armaments.main_armament = e.target.value; APP.updateUI(); });
        document.getElementById('comp_secondary_armament').addEventListener('change', (e) => { APP.state.armaments.secondary_armament = e.target.value; APP.updateUI(); });
        document.getElementById('comp_torpedo').addEventListener('change', (e) => { APP.state.armaments.torpedo = e.target.value; APP.updateUI(); });
        document.getElementById('comp_asw').addEventListener('change', (e) => { APP.state.armaments.asw = e.target.value; APP.updateUI(); });

        // Novos componentes
        document.getElementById('comp_fire_control').addEventListener('change', (e) => { APP.state.components.fire_control = e.target.value; APP.updateUI(); });
        document.getElementById('comp_torpedo_bulkhead').addEventListener('change', (e) => { APP.state.components.torpedo_bulkhead = e.target.value; APP.updateUI(); });
        document.getElementById('comp_fuel_tanks').addEventListener('change', (e) => { APP.state.components.fuel_tanks = e.target.value; APP.updateUI(); });
        document.getElementById('comp_shell_type').addEventListener('change', (e) => { APP.state.components.shell_type = e.target.value; APP.updateUI(); });
        document.getElementById('comp_propellant_type').addEventListener('change', (e) => { APP.state.components.propellant_type = e.target.value; APP.updateUI(); });

        document.getElementById('save_design_button').addEventListener('click', APP.saveState);
        document.getElementById('export_design_button').addEventListener('click', APP.exportDesign);
        document.getElementById('import_design_button').addEventListener('click', APP.importDesign);
    },

    // Função principal para calcular todas as estatísticas do navio
    calculateShipStats: function() {
        let totalWeight = 0;
        let totalCost = 0;
        let totalPowerOutput = 0; // Potência total gerada pelos motores
        let totalFuelCapacity = 0; // Capacidade total de combustível
        let totalPrecisionModifier = 1.0; // Multiplicador de precisão
        let totalReloadModifier = 1.0; // Multiplicador de recarga
        let totalStabilityModifier = 0; // Modificador de estabilidade
        let totalUpperWeightFactor = 0; // Fator de peso superior para estabilidade
        let maneuverabilityPenalty = 0; // Penalidade de manobrabilidade

        const hullData = APP.data.hulls[APP.state.hull];

        if (!hullData) {
            APP.state.calculated.statusMessage = "Selecione um tipo de casco para começar.";
            APP.state.calculated.statusType = "info";
            APP.state.calculated.totalWeight = 0;
            APP.state.calculated.totalCost = 0;
            APP.state.calculated.finalSpeed = 0;
            APP.state.calculated.finalRange = 0;
            APP.state.calculated.totalPrecisionModifier = 0;
            APP.state.calculated.totalStability = 0;
            return;
        }

        // 1. Cálculo do Casco
        totalWeight += hullData.base_tonnage;
        totalCost += hullData.base_cost;
        totalStabilityModifier += hullData.base_stability;
        const maxDisplacementCap = hullData.max_displacement_cap;

        // 2. Cálculo da Blindagem
        const armorTypeData = APP.data.armor_types[APP.state.armor.type];
        if (armorTypeData) {
            const armorZones = ['belt', 'deck', 'bow_stern', 'conning', 'superstructure', 'barbettes'];
            armorZones.forEach(zone => {
                const thickness = APP.state.armor[`${zone}_thickness`];
                if (thickness > 0) {
                    const armorWeight = thickness * 10 * armorTypeData.type_multiplier; // Ex: 10 tons por polegada de espessura
                    const armorCost = thickness * 100 * armorTypeData.cost_per_ton; // Ex: 100 unidades por polegada de espessura
                    totalWeight += armorWeight;
                    totalCost += armorCost;
                    totalUpperWeightFactor += armorWeight * armorTypeData.vertical_factor;
                }
            });
        }

        // 3. Cálculo do Motor
        const engineData = APP.data.engines[APP.state.engine_type];
        if (engineData) {
            // O slider de velocidade agora controla a potência que o jogador deseja alocar
            const desiredPowerUnits = APP.state.sliders.speed; // O slider vai de 0 a um valor máximo de "unidades de potência"
            const allocatedPower = desiredPowerUnits * engineData.power_output_per_unit; // Potência real em HP
            
            const engineWeight = allocatedPower / engineData.hp_per_ton;
            const engineCost = engineWeight * engineData.cost_multiplier * 50; // Custo base por tonelada de motor
            
            totalWeight += engineWeight;
            totalCost += engineCost;
            totalPowerOutput += allocatedPower;
            totalPrecisionModifier += engineData.precision_modifier;
            totalStabilityModifier += engineData.stability_modifier * (engineWeight / 1000); // Estabilidade do motor proporcional ao peso
        }


        // 4. Cálculo de Armamentos
        for (const armKey in APP.state.armaments) {
            const armId = APP.state.armaments[armKey];
            if (armId && APP.data.components.armament[armKey] && APP.data.components.armament[armKey].options[armId]) {
                const armData = APP.data.components.armament[armKey].options[armId];
                totalWeight += armData.weight * hullData.slots[armKey];
                totalCost += armData.cost * hullData.slots[armKey];
                totalPrecisionModifier += armData.precision_modifier * hullData.slots[armKey];
                totalReloadModifier += armData.reload_modifier * hullData.slots[armKey];
                totalUpperWeightFactor += armData.weight * armData.vertical_factor * hullData.slots[armKey];
            }
        }

        // 5. Cálculo de Novos Componentes (Sistemas de Controle, Proteção, Tanques, Munição, Propelente)
        for (const compCategoryKey in APP.data.components) {
            // Pular a categoria 'armament' que já foi tratada
            if (compCategoryKey === 'armament') continue;

            const category = APP.data.components[compCategoryKey];
            for (const compTypeKey in category.options) {
                const compId = APP.state.components[compTypeKey];
                if (compId && category.options[compTypeKey] && category.options[compTypeKey].options[compId]) {
                    const compData = category.options[compTypeKey].options[compId];
                    totalWeight += compData.weight || 0;
                    totalCost += compData.cost || 0;
                    totalPowerOutput -= (compData.power_consumption || 0); // Consome energia
                    totalFuelCapacity += (compData.fuel_capacity || 0); // Adiciona capacidade de combustível
                    maneuverabilityPenalty += (compData.maneuverability_penalty || 0);

                    // Aplicar modificadores de estatísticas gerais
                    if (compData.precision_modifier) totalPrecisionModifier += compData.precision_modifier;
                    if (compData.stability_modifier) totalStabilityModifier += compData.stability_modifier;
                    if (compData.range_modifier) totalFuelCapacity *= (1 + compData.range_modifier); // Modificador de alcance aplicado à capacidade de combustível
                    if (compData.cost_multiplier) totalCost *= (1 + compData.cost_multiplier -1); // Multiplicador de custo
                }
            }
        }
        
        // Ajuste de custo para munição/propelente (não adicionam peso, mas modificam custo/precisão/segurança)
        const shellTypeData = APP.data.components.ammunition_types.options.shell_type.options[APP.state.components.shell_type];
        if (shellTypeData) {
            totalCost *= shellTypeData.cost_multiplier;
            // Poderíamos adicionar modificadores de dano/penetração aqui para exibição
        }

        const propellantTypeData = APP.data.components.ammunition_types.options.propellant_type.options[APP.state.components.propellant_type];
        if (propellantTypeData) {
            totalCost *= propellantTypeData.cost_multiplier;
            totalPrecisionModifier += propellantTypeData.precision_modifier;
            // Poderíamos adicionar modificadores de segurança aqui
        }


        // Verificar se o peso total excede o limite de deslocamento do casco
        let statusMessage = "Projeto válido.";
        let statusType = "ok";

        if (totalWeight > maxDisplacementCap) {
            const excess = totalWeight - maxDisplacementCap;
            statusMessage = `Peso excedido em ${excess.toFixed(0)} toneladas! Reduza componentes ou mude o casco.`;
            statusType = "danger";
            // Penalidade severa por excesso de peso
            totalPowerOutput *= 0.5; // Reduz drasticamente a potência efetiva
            totalPrecisionModifier -= 0.2; // Penalidade de precisão
            totalStabilityModifier -= 20; // Grande penalidade de estabilidade
        }

        // Fórmulas de Balanceamento (Tabela 3)
        // Constantes ajustáveis
        const C1_SPEED = 0.5; // Coeficiente base de velocidade
        const C2_SPEED = 0.8; // Expoente para retornos decrescentes de velocidade
        const C3_DRAG = 0.0001; // Fator de arrasto do casco (simplificado)

        const C4_FUEL_CONSUMPTION = 0.001; // Consumo base de combustível por HP
        const C5_FUEL_SPEED_FACTOR = 2.0; // Fator de consumo de combustível em velocidades mais altas

        const C6_STABILITY = 1.0; // Coeficiente base de estabilidade
        const C7_STABILITY_WEIGHT_DIVISOR = 5000; // Divisor para peso total na estabilidade
        const C8_STABILITY_UPPER_WEIGHT_DIVISOR = 100; // Divisor para peso superior na estabilidade
        const C9_STABILITY_BEAM_DIVISOR = 10; // Divisor para boca na estabilidade (simplificado)
        const C10_STABILITY_DRAFT_DIVISOR = 10; // Divisor para calado na estabilidade (simplificado)

        // Velocidade (nós)
        let finalSpeed = C1_SPEED * Math.pow(totalPowerOutput / totalWeight, C2_SPEED) - C3_DRAG * totalWeight;
        finalSpeed = Math.max(0, finalSpeed); // Velocidade não pode ser negativa

        // Penalidade de manobrabilidade afeta a velocidade máxima
        finalSpeed *= (1 - maneuverabilityPenalty);

        // Taxa de Consumo de Combustível
        const fuelConsumptionRate = C4_FUEL_CONSUMPTION * totalPowerOutput * (1 + Math.pow(finalSpeed / hullData.base_speed, C5_FUEL_SPEED_FACTOR));
        
        // Alcance (milhas náuticas)
        let finalRange = 0;
        if (fuelConsumptionRate > 0) {
            finalRange = (totalFuelCapacity / fuelConsumptionRate) * finalSpeed;
        }
        finalRange = Math.max(0, finalRange); // Alcance não pode ser negativo

        // Estabilidade (Pontuação 0-100)
        // Simplificando boca e calado como constantes para cada casco por enquanto
        const hullBeam = hullData.base_tonnage / 100; // Exemplo simplificado
        const hullDraft = hullData.base_tonnage / 200; // Exemplo simplificado

        let finalStability = C6_STABILITY * (hullData.base_stability + (totalWeight / C7_STABILITY_WEIGHT_DIVISOR) - (totalUpperWeightFactor / C8_STABILITY_UPPER_WEIGHT_DIVISOR) + (hullBeam / C9_STABILITY_BEAM_DIVISOR) - (hullDraft / C10_STABILITY_DRAFT_DIVISOR));
        finalStability = Math.min(100, Math.max(0, finalStability)); // Limitar entre 0 e 100

        // Penalidade de precisão por baixa estabilidade
        if (finalStability < 50) {
            totalPrecisionModifier -= (50 - finalStability) * 0.005; // -0.5% de precisão por ponto abaixo de 50
            if (statusType === "ok") { // Não sobrescrever status de perigo
                statusMessage = "Baixa Estabilidade: Afeta a precisão!";
                statusType = "warning";
            }
        }
        
        // Atualiza o estado calculado
        APP.state.calculated.totalWeight = totalWeight;
        APP.state.calculated.totalCost = totalCost;
        APP.state.calculated.totalPowerOutput = totalPowerOutput;
        APP.state.calculated.totalFuelCapacity = totalFuelCapacity;
        APP.state.calculated.finalSpeed = finalSpeed;
        APP.state.calculated.finalRange = finalRange;
        APP.state.calculated.totalPrecisionModifier = Math.max(0, totalPrecisionModifier); // Precisão não pode ser negativa
        APP.state.calculated.totalStability = finalStability;
        APP.state.calculated.statusMessage = statusMessage;
        APP.state.calculated.statusType = statusType;
    },

    // Atualiza a interface do usuário com os valores calculados
    updateUI: function() {
        APP.calculateShipStats(); // Recalcula as estatísticas a cada atualização da UI

        const calculated = APP.state.calculated;
        const hullData = APP.data.hulls[APP.state.hull];

        // Atualizar campos de texto
        document.getElementById('ship_name').value = APP.state.shipName;
        document.getElementById('country').value = APP.state.country;
        document.getElementById('naval_doctrine').value = APP.state.doctrine;
        document.getElementById('hull_type').value = APP.state.hull || '';
        document.getElementById('engine_type').value = APP.state.engine_type || '';
        document.getElementById('armor_type').value = APP.state.armor.type || '';

        // Atualizar sliders de blindagem
        document.getElementById('armor_belt_thickness').value = APP.state.armor.belt_thickness;
        document.getElementById('armor_belt_display').textContent = `${APP.state.armor.belt_thickness} in`;
        document.getElementById('armor_deck_thickness').value = APP.state.armor.deck_thickness;
        document.getElementById('armor_deck_display').textContent = `${APP.state.armor.deck_thickness} in`;
        document.getElementById('armor_bow_stern_thickness').value = APP.state.armor.bow_stern_thickness;
        document.getElementById('armor_bow_stern_display').textContent = `${APP.state.armor.bow_stern_thickness} in`;
        document.getElementById('armor_conning_thickness').value = APP.state.armor.conning_thickness;
        document.getElementById('armor_conning_display').textContent = `${APP.state.armor.conning_thickness} in`;
        document.getElementById('armor_superstructure_thickness').value = APP.state.armor.superstructure_thickness;
        document.getElementById('armor_superstructure_display').textContent = `${APP.state.armor.superstructure_thickness} in`;
        document.getElementById('armor_barbettes_thickness').value = APP.state.armor.barbettes_thickness;
        document.getElementById('armor_barbettes_display').textContent = `${APP.state.armor.barbettes_thickness} in`;


        // Atualizar sliders de componentes (armamento e novos módulos)
        for (const categoryKey in APP.data.components) {
            const category = APP.data.components[categoryKey];
            for (const compKey in category.options) {
                const select = document.getElementById(`comp_${compKey}`);
                if (select) {
                    if (categoryKey === 'armament') {
                        select.value = APP.state.armaments[compKey] || Object.keys(category.options[compKey].options)[0];
                    } else {
                        select.value = APP.state.components[compKey] || Object.keys(category.options[compKey].options)[0];
                    }
                }
            }
        }

        // Atualizar displays do resumo
        document.getElementById('displacement_display').textContent = `${calculated.totalWeight.toFixed(0)} / ${hullData ? hullData.max_displacement_cap.toFixed(0) : 0} t`;
        document.getElementById('cost_display').textContent = `${calculated.totalCost.toFixed(0)} CR`;
        document.getElementById('speed_display').textContent = `${calculated.finalSpeed.toFixed(1)} nós`;
        document.getElementById('range_display').textContent = `${calculated.finalRange.toFixed(0)} milhas`;
        document.getElementById('precision_display').textContent = `${(calculated.totalPrecisionModifier * 100).toFixed(1)}%`;
        document.getElementById('stability_display').textContent = `${calculated.totalStability.toFixed(0)}%`;


        // Atualizar barras de progresso
        const displacementBar = document.getElementById('displacement_bar');
        const displacementPercentage = hullData ? (calculated.totalWeight / hullData.max_displacement_cap) * 100 : 0;
        displacementBar.style.width = `${Math.min(100, displacementPercentage)}%`;
        displacementBar.className = 'progress-fill ' + (displacementPercentage > 100 ? 'bg-red-500' : 'bg-blue-500');

        // Para slots e energia, precisaremos calcular os totais e limites
        let totalArmamentSlots = 0;
        let usedArmamentSlots = 0;
        let totalUtilitySlots = 0;
        let usedUtilitySlots = 0;
        let totalPowerCapacity = calculated.totalPowerOutput; // Potência total gerada
        let usedPower = 0;

        if (hullData) {
            totalArmamentSlots = hullData.slots.main_armament + hullData.slots.secondary_armament + hullData.slots.torpedo + hullData.slots.asw;
            totalUtilitySlots = hullData.slots.utility;

            // Calcular slots usados e consumo de energia
            for (const armKey in APP.state.armaments) {
                const armId = APP.state.armaments[armKey];
                if (armId && APP.data.components.armament[armKey] && APP.data.components.armament[armKey].options[armId]) {
                    usedPower += (APP.data.components.armament[armKey].options[armId].power_consumption || 0) * hullData.slots[armKey];
                    if (armId !== 'none') { // Contar slots se algo for selecionado
                        if (armKey === 'main_armament' || armKey === 'secondary_armament' || armKey === 'torpedo' || armKey === 'asw') {
                            usedArmamentSlots += hullData.slots[armKey];
                        }
                    }
                }
            }
            // Para os novos componentes, eles consomem slots de utilidade
            for (const compCategoryKey in APP.data.components) {
                if (compCategoryKey === 'armament' || compCategoryKey === 'ammunition_types') continue; // Já tratamos armamento, munição não usa slots

                const category = APP.data.components[compCategoryKey];
                for (const compTypeKey in category.options) {
                    const compId = APP.state.components[compTypeKey];
                    if (compId && category.options[compTypeKey] && category.options[compTypeKey].options[compId]) {
                        usedPower += (category.options[compTypeKey].options[compId].power_consumption || 0);
                        usedUtilitySlots += (category.options[compTypeKey].options[compId].space_required || 0);
                    }
                }
            }
        }
        
        document.getElementById('armament_slots_display').textContent = `${usedArmamentSlots} / ${totalArmamentSlots}`;
        document.getElementById('utility_slots_display').textContent = `${usedUtilitySlots} / ${totalUtilitySlots}`;
        document.getElementById('power_display').textContent = `${usedPower.toFixed(0)} / ${totalPowerCapacity.toFixed(0)} MW`;

        const armamentSlotsBar = document.getElementById('armament_slots_bar');
        const armamentSlotsPercentage = totalArmamentSlots > 0 ? (usedArmamentSlots / totalArmamentSlots) * 100 : 0;
        armamentSlotsBar.style.width = `${Math.min(100, armamentSlotsPercentage)}%`;
        armamentSlotsBar.className = 'progress-fill ' + (armamentSlotsPercentage > 100 ? 'bg-red-500' : 'bg-blue-500');

        const utilitySlotsBar = document.getElementById('utility_slots_bar');
        const utilitySlotsPercentage = totalUtilitySlots > 0 ? (usedUtilitySlots / totalUtilitySlots) * 100 : 0;
        utilitySlotsBar.style.width = `${Math.min(100, utilitySlotsPercentage)}%`;
        utilitySlotsBar.className = 'progress-fill ' + (utilitySlotsPercentage > 100 ? 'bg-red-500' : 'bg-blue-500');

        const powerBar = document.getElementById('power_bar');
        const powerPercentage = totalPowerCapacity > 0 ? (usedPower / totalPowerCapacity) * 100 : 0;
        powerBar.style.width = `${Math.min(100, powerPercentage)}%`;
        powerBar.className = 'progress-fill ' + (powerPercentage > 100 ? 'bg-red-500' : 'bg-blue-500');

        // Atualizar slider de velocidade e alcance (min/max dinâmicos e valores)
        const speedSlider = document.getElementById('speed_slider');
        const rangeSlider = document.getElementById('range_slider');

        if (hullData && engineData) {
            // O slider de velocidade controla a alocação de potência
            const maxPowerUnits = Math.floor((hullData.max_displacement_cap - totalWeight + (APP.state.sliders.speed * engineData.power_output_per_unit / engineData.hp_per_ton)) / (engineData.power_output_per_unit / engineData.hp_per_ton));
            speedSlider.max = Math.max(0, maxPowerUnits); // Limite de unidades de potência baseadas no peso restante
            speedSlider.value = APP.state.sliders.speed;
            document.getElementById('speed_slider_display').textContent = `${APP.state.sliders.speed.toFixed(0)} unidades`;

            // O slider de alcance controla a alocação de capacidade de combustível
            const maxFuelUnits = Math.floor((hullData.max_displacement_cap - totalWeight + (APP.state.sliders.range * APP.data.components.auxiliary_systems.options.fuel_tanks.options.large_tank.weight)) / APP.data.components.auxiliary_systems.options.fuel_tanks.options.large_tank.weight); // Simplificado para o maior tanque
            rangeSlider.max = Math.max(0, maxFuelUnits); // Limite de unidades de tanque de combustível
            rangeSlider.value = APP.state.sliders.range;
            document.getElementById('range_slider_display').textContent = `${APP.state.sliders.range.toFixed(0)} unidades`;

        } else {
            speedSlider.max = 0;
            speedSlider.value = 0;
            rangeSlider.max = 0;
            rangeSlider.value = 0;
            document.getElementById('speed_slider_display').textContent = `0 unidades`;
            document.getElementById('range_slider_display').textContent = `0 unidades`;
        }

        // Atualizar painel de status
        const statusPanel = document.getElementById('status_panel');
        statusPanel.textContent = calculated.statusMessage;
        statusPanel.className = `status-indicator status-${calculated.statusType}`;
    },

    // Salva o estado atual do projeto no localStorage
    saveState: function() {
        localStorage.setItem('shipDesign', JSON.stringify(APP.state));
        alert('Projeto salvo com sucesso!');
    },

    // Carrega o estado do projeto do localStorage
    loadState: function() {
        const savedState = localStorage.getItem('shipDesign');
        if (savedState) {
            APP.state = JSON.parse(savedState);
            // Garantir que todos os campos do estado existam, mesmo se não estiverem no salvo
            APP.state = {
                shipName: "Novo Navio", country: "N/A", doctrine: "N/A", hull: null, engine_type: null,
                armor: { type: 'none', belt_thickness: 0, deck_thickness: 0, bow_stern_thickness: 0, conning_thickness: 0, superstructure_thickness: 0, barbettes_thickness: 0 },
                sliders: { displacement: 0, speed: 0, range: 0 },
                armaments: { main_armament: null, secondary_armament: null, torpedo: null, asw: null },
                components: { fire_control: null, torpedo_bulkhead: null, fuel_tanks: null, shell_type: null, propellant_type: null },
                calculated: { totalWeight: 0, totalCost: 0, finalSpeed: 0, finalRange: 0, totalPrecisionModifier: 0, totalStability: 0, statusMessage: "", statusType: "" },
                ...APP.state
            };
            // Preencher a UI com os dados carregados
            document.getElementById('ship_name').value = APP.state.shipName;
            document.getElementById('country').value = APP.state.country;
            document.getElementById('naval_doctrine').value = APP.state.doctrine;
            document.getElementById('hull_type').value = APP.state.hull || '';
            document.getElementById('engine_type').value = APP.state.engine_type || '';
            document.getElementById('armor_type').value = APP.state.armor.type || '';

            document.getElementById('armor_belt_thickness').value = APP.state.armor.belt_thickness;
            document.getElementById('armor_deck_thickness').value = APP.state.armor.deck_thickness;
            document.getElementById('armor_bow_stern_thickness').value = APP.state.armor.bow_stern_thickness;
            document.getElementById('armor_conning_thickness').value = APP.state.armor.conning_thickness;
            document.getElementById('armor_superstructure_thickness').value = APP.state.armor.superstructure_thickness;
            document.getElementById('armor_barbettes_thickness').value = APP.state.armor.barbettes_thickness;

            document.getElementById('speed_slider').value = APP.state.sliders.speed;
            document.getElementById('range_slider').value = APP.state.sliders.range;

            for (const arm in APP.state.armaments) {
                const select = document.getElementById(`comp_${arm}`);
                if (select) select.value = APP.state.armaments[arm] || '';
            }
            for (const comp in APP.state.components) {
                const select = document.getElementById(`comp_${comp}`);
                if (select) select.value = APP.state.components[comp] || '';
            }

            APP.updateUI();
        }
    },

    // Exporta o projeto como JSON
    exportDesign: function() {
        const designJson = JSON.stringify(APP.state, null, 2);
        const blob = new Blob([designJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${APP.state.shipName.replace(/ /g, '_')}_design.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Importa o projeto de um arquivo JSON
    importDesign: function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = e => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    try {
                        const importedState = JSON.parse(event.target.result);
                        APP.state = { ...APP.state, ...importedState }; // Mescla o estado importado
                        APP.updateUI();
                        alert('Projeto importado com sucesso!');
                    } catch (error) {
                        alert('Erro ao importar o projeto: Arquivo JSON inválido.');
                        console.error('Erro ao importar JSON:', error);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    },

    // Abre a ficha do navio em uma nova janela
    openShipSheet: function() {
        // Salva o estado atual para que a ficha possa carregá-lo
        APP.saveState();
        // Abre a nova janela
        window.open('ship_sheet.html', '_blank');
    }
};

// Inicializa a aplicação quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', APP.init);

