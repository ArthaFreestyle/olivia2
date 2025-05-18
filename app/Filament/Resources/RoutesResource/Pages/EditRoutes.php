<?php

namespace App\Filament\Resources\RoutesResource\Pages;

use App\Filament\Resources\RoutesResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditRoutes extends EditRecord
{
    protected static string $resource = RoutesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
