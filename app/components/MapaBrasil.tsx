"use client";

import React from 'react';

interface MapaBrasilProps {
  onStateClick: (sigla: string) => void;
  selectedState: string | null;
}

// Coordenadas simplificadas porém com proporções reais para um visual industrial limpo
const states = [
  { id: 'AC', name: 'Acre', path: 'M34.3,161.8l16.1,1.1l5.5,10l-12.7,14.6l-18.4-1.1L12.5,177l6.8-13L34.3,161.8z' },
  { id: 'AL', name: 'Alagoas', path: 'M448.9,183l4.6-0.9l2.8,4.1l-1.3,4.6l-6,0.3L448.9,183z' },
  { id: 'AM', name: 'Amazonas', path: 'M61.9,64.2l53.5,1.5l37,13.8l20,38.2l-10,41.9l-38.6,1.4l-31.5-12.8l-30.8-21.6L61.9,64.2z' },
  { id: 'AP', name: 'Amapá', path: 'M236.4,26.7l16.2,14.7l-0.3,19.3l-16.7,6l-15.3-10l1.1-18.4L236.4,26.7z' },
  { id: 'BA', name: 'Bahia', path: 'M344.5,142.1l32.5,16.5l14.7,59.3l-18.5,41.4l-52.6,3l-45.7-44.1l2.2-46.1L344.5,142.1z' },
  { id: 'CE', name: 'Ceará', path: 'M387.2,74.9l23.1,8.5l2.2,27.7l-15,19.9l-22.1-4l-11.4-23.9L387.2,74.9z' },
  { id: 'DF', name: 'Distrito Federal', path: 'M296,225l4,0l0,4l-4,0L296,225z' },
  { id: 'ES', name: 'Espírito Santo', path: 'M386,281l9,18l-10,12l-8-14L386,281z' },
  { id: 'GO', name: 'Goiás', path: 'M265.8,187.4l43.2,16.2l12.7,54.8l-23.2,34.3l-46.1-5.6l-11.2-43.2L265.8,187.4z' },
  { id: 'MA', name: 'Maranhão', path: 'M302,68l33,18l1,58l-36,19l-42-25l4-53L302,68z' },
  { id: 'MG', name: 'Minas Gerais', path: 'M302,265l51-4l38,41l-16,58l-65,22l-41-38L302,265z' },
  { id: 'MS', name: 'Mato Grosso do Sul', path: 'M201,316l42,16l14,56l-38,30l-45-12l-10-53L201,316z' },
  { id: 'MT', name: 'Mato Grosso', path: 'M168,136l67,24l22,96l-38,62l-71-20l-28-76L168,136z' },
  { id: 'PA', name: 'Pará', path: 'M165,48l74,3l41,75l-26,71l-84,1l-43-68L165,48z' },
  { id: 'PB', name: 'Paraíba', path: 'M437,126l15,1l2,12l-15,4l-5-10L437,126z' },
  { id: 'PE', name: 'Pernambuco', path: 'M404,142l40,4l5,12l-45,7l-8-12L404,142z' },
  { id: 'PI', name: 'Piauí', path: 'M344,83l22,12l-6,67l-34,22l-19-15L344,83z' },
  { id: 'PR', name: 'Paraná', path: 'M216,423l48,12l10,34l-52,8l-18-28L216,423z' },
  { id: 'RJ', name: 'Rio de Janeiro', path: 'M358,368l18,6l2,14l-22,4l-6-16L358,368z' },
  { id: 'RN', name: 'Rio Grande do Norte', path: 'M435,93l18,10l-6,18l-18-2L435,93z' },
  { id: 'RO', name: 'Rondônia', path: 'M105,188l38,16l1,41l-34,26l-21-28L105,188z' },
  { id: 'RR', name: 'Roraima', path: 'M115,15l42,12l1,46l-38,18l-26-34L115,15z' },
  { id: 'RS', name: 'Rio Grande do Sul', path: 'M205,485l51,12l-4,48l-52,2l-12-38L205,485z' },
  { id: 'SC', name: 'Santa Catarina', path: 'M255,445l32,10l1,28l-36,8l-10-25L255,445z' },
  { id: 'SE', name: 'Sergipe', path: 'M438,198l8,4l-3,8l-10-2L438,198z' },
  { id: 'SP', name: 'São Paulo', path: 'M265,378l46,12l18,34l-54,18l-32-34L265,378z' },
  { id: 'TO', name: 'Tocantins', path: 'M265,118l32,24l-3,62l-36,22l-15-46L265,118z' },
];

export default function MapaBrasil({ onStateClick, selectedState }: MapaBrasilProps) {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <svg
        viewBox="0 0 500 550"
        className="w-full h-full drop-shadow-[0_0_30px_rgba(234,29,44,0.1)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {states.map((state) => (
          <path
            key={state.id}
            d={state.path}
            fill={selectedState === state.id ? '#EA1D2C' : '#334155'}
            stroke={selectedState === state.id ? '#ffffff' : '#1e293b'}
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-500 hover:fill-[#EA1D2C] hover:opacity-80 active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              onStateClick(state.id);
            }}
          >
            <title>{state.name}</title>
          </path>
        ))}
      </svg>
    </div>
  );
}
