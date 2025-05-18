<?php

namespace App\Filament\Resources\RoutePointsResource\Pages;

use App\Filament\Resources\RoutePointsResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListRoutePoints extends ListRecords
{
    protected static string $resource = RoutePointsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
