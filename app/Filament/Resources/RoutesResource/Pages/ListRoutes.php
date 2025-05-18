<?php

namespace App\Filament\Resources\RoutesResource\Pages;

use App\Filament\Resources\RoutesResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListRoutes extends ListRecords
{
    protected static string $resource = RoutesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
