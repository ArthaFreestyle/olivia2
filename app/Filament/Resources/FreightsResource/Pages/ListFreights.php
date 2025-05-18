<?php

namespace App\Filament\Resources\FreightsResource\Pages;

use App\Filament\Resources\FreightsResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListFreights extends ListRecords
{
    protected static string $resource = FreightsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
