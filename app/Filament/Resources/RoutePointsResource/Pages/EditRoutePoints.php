<?php

namespace App\Filament\Resources\RoutePointsResource\Pages;

use App\Filament\Resources\RoutePointsResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditRoutePoints extends EditRecord
{
    protected static string $resource = RoutePointsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
