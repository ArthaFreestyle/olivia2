<?php

namespace App\Filament\Resources\FreightUserWeightsResource\Pages;

use App\Filament\Resources\FreightUserWeightsResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListFreightUserWeights extends ListRecords
{
    protected static string $resource = FreightUserWeightsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
