<?php

namespace App\Filament\Resources\FreightsResource\Pages;

use App\Filament\Resources\FreightsResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditFreights extends EditRecord
{
    protected static string $resource = FreightsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
