<?php

namespace App\Filament\Resources\FreightUserWeightsResource\Pages;

use App\Filament\Resources\FreightUserWeightsResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditFreightUserWeights extends EditRecord
{
    protected static string $resource = FreightUserWeightsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
